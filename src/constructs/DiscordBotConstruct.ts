import * as path from "path";
import { Function, Runtime } from "@aws-cdk/aws-lambda";
import {
  Cors,
  LambdaIntegration,
  RequestValidator,
  RestApi
} from "@aws-cdk/aws-apigateway";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Construct, Duration } from "@aws-cdk/core";
import { Secret } from "@aws-cdk/aws-secretsmanager";

/**
 * The properties required for the Discord Bot construct. Specifically
 * requires the Lambda function where commands will be sent.
 */
export interface DiscordBotConstructProps {
  commandsLambdaFunction: Function;
}

/**
 * A CDK Construct for setting up a serverless Discord bot.
 */
export class DiscordBotConstruct extends Construct {
  /**
   * The Secrets for our Discord APIs.
   */
  public readonly discordAPISecrets: Secret;

  /**
   * The constructor for building the stack.
   * @param {Construct} scope The Construct scope to create the Construct in.
   * @param {string} id The ID of the Construct to use.
   * @param {DiscordBotConstructProps} props The properties to configure the Construct.
   */
  constructor(scope: Construct, id: string, props: DiscordBotConstructProps) {
    super(scope, id);

    // Create our Secrets for our Discord APIs.
    this.discordAPISecrets = new Secret(this, "discordPublicKey", {
      description: "Discord Public Key",
      secretName: "discordPublicKey"
    });

    // Create the Lambda for handling Interactions from our Discord bot.
    const discordBotLambda = new NodejsFunction(this, "discord-bot-lambda", {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, "../functions/DiscordBotFunction.ts"),
      environment: {
        DISCORD_CREDENTIALS: `${
          Secret.fromSecretAttributes(this, "discordCredentials", {
            secretCompleteArn: process.env.DISCORD_CREDENTIALS_ARN
          }).secretValue
        }`,
        COMMAND_LAMBDA_ARN: props.commandsLambdaFunction.functionArn
      },
      handler: "handler",
      timeout: Duration.seconds(3)
    });

    props.commandsLambdaFunction.addEnvironment(
      "DISCORD_BOT_API_KEY_NAME",
      this.discordAPISecrets.secretName
    );

    this.discordAPISecrets.grantRead(discordBotLambda);
    this.discordAPISecrets.grantRead(props.commandsLambdaFunction);
    props.commandsLambdaFunction.grantInvoke(discordBotLambda);

    // Create our API Gateway
    const discordBotAPI = new RestApi(this, "discord-bot-api", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS
      }
    });
    const discordBotAPIValidator = new RequestValidator(
      this,
      "discord-bot-api-validator",
      {
        restApi: discordBotAPI,
        validateRequestBody: true,
        validateRequestParameters: true
      }
    );

    // User authentication endpoint configuration
    const discordBotEventItems = discordBotAPI.root.addResource("event", {
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"]
      }
    });

    // Transform our requests and responses as appropriate.
    const discordBotPOSTIntegration: LambdaIntegration = new LambdaIntegration(
      discordBotLambda,
      {
        proxy: false,
        requestTemplates: {
          "application/json":
            '{\r\n\
              "timestamp": "$input.params(\'x-signature-timestamp\')",\r\n\
              "signature": "$input.params(\'x-signature-ed25519\')",\r\n\
              "kick": "$input.params(\'kick\')",\r\n\
              "jsonBody" : $input.json(\'$\')\r\n\
            }'
        },
        integrationResponses: [
          {
            statusCode: "200"
          },
          {
            statusCode: "401",
            selectionPattern: ".*[UNAUTHORIZED].*",
            responseTemplates: {
              "application/json": "invalid request signature"
            }
          }
        ]
      }
    );

    const discordBotGETIntegration: LambdaIntegration = new LambdaIntegration(
      discordBotLambda,
      {
        proxy: false,
        requestTemplates: {
          "application/json":
            '{\r\n\
              "discordId": "$input.params(\'discordId\')",\r\n\
              "tempRandToken": "$input.params(\'tempRandToken\')",\r\n\
              "channels": "$input.params(\'channels\')",\r\n\
              "email": "$input.params(\'email\')"\r\n\
            }'
        },
        integrationResponses: [
          {
            statusCode: "302",
            responseParameters: {
              "method.response.header.Location":
                "integration.response.body.location"
            }
          },
          {
            statusCode: "401",
            selectionPattern: ".*[UNAUTHORIZED].*",
            responseTemplates: {
              "application/json": "invalid request signature"
            }
          }
        ]
      }
    );

    discordBotEventItems.addMethod("GET", discordBotGETIntegration, {
      apiKeyRequired: false,
      methodResponses: [
        {
          statusCode: "302",
          responseParameters: {
            "method.response.header.Location": true
          }
        },
        {
          statusCode: "401"
        }
      ]
    });

    // Add a POST method for the Discord APIs.
    discordBotEventItems.addMethod("POST", discordBotPOSTIntegration, {
      apiKeyRequired: false,
      requestValidator: discordBotAPIValidator,
      methodResponses: [
        {
          statusCode: "200"
        },
        {
          statusCode: "401"
        }
      ]
    });
  }
}

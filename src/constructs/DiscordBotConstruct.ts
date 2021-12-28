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
import { makeHtmlErr } from "../functions/makeHtmlErr";

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
      handler: "handler",
      timeout: Duration.seconds(20),
      memorySize: 2048,
      environment: {
        DISCORD_CREDENTIALS: `${
          Secret.fromSecretAttributes(this, "discordCredentials", {
            secretCompleteArn: process.env.DISCORD_CREDENTIALS_ARN
          }).secretValue
        }`,
        WIX_CREDENTIALS: `${
          Secret.fromSecretAttributes(this, "wixCredentials", {
            secretCompleteArn: process.env.WIX_CREDENTIALS_ARN
          }).secretValue
        }`,
        COMMAND_LAMBDA_ARN: props.commandsLambdaFunction.functionArn
      }
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

    // Automations from WIX Send POST requests- assignBadge, kickMember
    // Also when a new product is purchased (from event handler)
    const discordBotPOSTIntegration: LambdaIntegration = new LambdaIntegration(
      discordBotLambda,
      {
        proxy: false,
        requestTemplates: {
          "application/json":
            '{\r\n\
              "channels": "$input.params(\'channels\')",\r\n\
              "discordId": "$input.params(\'discordId\')",\r\n\
              "apiKey": "$input.params(\'apiKey\')",\r\n\
              "json" : $input.json(\'$\')\r\n\
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
              "code": "$input.params(\'code\')"\r\n\
            }'
        },
        integrationResponses: [
          {
            statusCode: "302",
            responseParameters: {
              "method.response.header.Location": "integration.response.body.location",
              "method.response.header.Content-Type": "'text/html'"
            },
            responseTemplates: {
              "text/html": "$input.path('$')"
            }
          },
          {
            statusCode: "401",
            selectionPattern: ".*[UNAUTHORIZED].*",
            responseParameters: {
              "method.response.header.Content-Type": "'text/html'"
            },
            responseTemplates: {
              "text/html": makeHtmlErr(
                // eslint-disable-next-line max-len
                ".It is highly unlikely that you should see this error message. \\n If you do, it is because the request timed out after 20 seconds \\n It is possible that you were still registered for the Guild however. \\n If you still do not have access, please contact Danny.."
              )
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
            "method.response.header.Location": true,
            "method.response.header.Content-Type": true
          }
        },
        {
          statusCode: "401",
          responseParameters: {
            "method.response.header.Content-Type": true
          }
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

    discordBotAPI.addUsagePlan("UsagePlan", {
      name: "discord-bot-api-usage-plan",
      throttle: {
        rateLimit: 100,
        burstLimit: 20
      }
    });
  }
}

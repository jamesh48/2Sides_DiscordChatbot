import * as path from "path";
import { Runtime } from "@aws-cdk/aws-lambda";
import {
  Cors,
  LambdaIntegration,
  RequestValidator,
  RestApi
} from "@aws-cdk/aws-apigateway";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Construct, Duration } from "@aws-cdk/core";
import { Secret } from "@aws-cdk/aws-secretsmanager";
import { makeHtmlErr } from "../functions/utils/registrationPortals/makeHtmlErr";

export class DiscordBotProxyConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const discordBotProxyLambda = new NodejsFunction(this, "discord-bot-proxy-lambda", {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, "../functions/DiscordBotProxyFunction.ts"),
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
        SENDGRID_API_KEY: `${
          Secret.fromSecretAttributes(this, "sendgrid-api-key", {
            secretCompleteArn: process.env.SENDGRID_API_KEY_ARN
          }).secretValue
        }`,
        SECRET_URLS: `${
          Secret.fromSecretAttributes(this, "SecretURLs", {
            secretCompleteArn: process.env.SECRET_URLS_ARN
          }).secretValue
        }`
      }
    });

    const discordBotProxyAPI = new RestApi(this, "discord-bot-proxy-api", {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS
      }
    });

    const discordBotAPIValidator = new RequestValidator(
      this,
      "discord-bot-api-validator",
      {
        restApi: discordBotProxyAPI,
        validateRequestBody: true,
        validateRequestParameters: true
      }
    );

    // User authentication endpoint configuration
    const discordBotEventItems = discordBotProxyAPI.root.addResource("event", {
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"]
      }
    });

    discordBotProxyAPI.addUsagePlan("UsagePlan", {
      name: "discord-bot-api-proxy-usage-plan",
      throttle: {
        rateLimit: 100,
        burstLimit: 20
      }
    });

    // Automations from WIX Send POST requests- assignBadge, kickMember
    // Also when a new product is purchased (from event handler)
    const discordBotProxyPOSTIntegration: LambdaIntegration = new LambdaIntegration(
      discordBotProxyLambda,
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

    const discordBotProxyGETIntegration: LambdaIntegration = new LambdaIntegration(
      discordBotProxyLambda,
      {
        proxy: false,
        requestTemplates: {
          "application/json":
            '{\r\n\
              "code": "$input.params(\'code\')",\r\n\
              "discordId": "$input.params(\'discordId\')",\r\n\
              "email": "$input.params(\'email\')",\r\n\
              "x": "$input.params(\'x\')",\r\n\
              "tempRandToken": "$input.params(\'tempRandToken\')"\r\n\
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
                ".It is unlikely that you should see this error message. \\n If you do, it is because of an internal server error \\n It is possible that you were still registered for the Guild however. \\n If you still do not have access, please contact info@dannygoldsmithmagic.com.."
              )
            }
          }
        ]
      }
    );

    // Add a POST method for the Discord APIs.
    discordBotEventItems.addMethod("POST", discordBotProxyPOSTIntegration, {
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

    discordBotEventItems.addMethod("GET", discordBotProxyGETIntegration, {
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
  }
}

require("dotenv").config();
import * as path from "path";
import { Secret } from "@aws-cdk/aws-secretsmanager";
import { Runtime } from "@aws-cdk/aws-lambda";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Construct, Duration, Stack } from "@aws-cdk/core";
// Don't alias this path.
import { DiscordBotConstruct } from "../constructs/DiscordBotConstruct";

/**
 * Creates a sample Discord bot endpoint that can be used.
 */
export class DiscordBotStack extends Stack {
  /**
   * The constructor for building the stack.
   * @param {Construct} scope The Construct scope to create the stack in.
   * @param {string} id The ID of the stack to use.
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Commands Lambda
    const discordCommandsLambda = new NodejsFunction(
      this,
      "discord-commands-lambda",
      {
        runtime: Runtime.NODEJS_14_X,
        entry: path.join(__dirname, "../lambda/lambdaServer/lambdaServer.ts"),
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
        },
        handler: "handler",
        timeout: Duration.seconds(20)
      }
    );

    new DiscordBotConstruct(this, "discord-bot-endpoint", {
      commandsLambdaFunction: discordCommandsLambda
    });
  }
}

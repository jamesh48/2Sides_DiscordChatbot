require("dotenv").config();
import { Construct, Stack } from "@aws-cdk/core";
// Don't alias this path.
import { DiscordBotProxyConstruct } from "../constructs/DiscordBotProxyConstruct";

/**
 * Creates a sample Discord bot endpoint that can be used.
 */
export class DiscordBotProxyStack extends Stack {
  /**
   * The constructor for building the stack.
   * @param {Construct} scope The Construct scope to create the stack in.
   * @param {string} id The ID of the stack to use.
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new DiscordBotProxyConstruct(this, "discord-bot-proxy-endpoint");
  }
}

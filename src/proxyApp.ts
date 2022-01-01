import { App } from "@aws-cdk/core";
// Dont alias this path.
import { DiscordBotProxyStack } from "./lib/construct-proxy-stack";

const app = new App();
new DiscordBotProxyStack(app, "DiscordBotProxyStack");

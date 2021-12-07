import { App } from "@aws-cdk/core";
// Dont alias this path.
import { DiscordBotStack } from "./lib/construct-stack";

const app = new App();
new DiscordBotStack(app, "DiscordBotStack");

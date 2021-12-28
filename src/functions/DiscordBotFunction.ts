import { Lambda } from "aws-sdk";
import { Context, Callback } from "aws-lambda";
import { DiscordEventRequest, DiscordEventResponse } from "Types";
import { commandLambdaARN } from "./constants/EnvironmentProps";
import { RouteCommand } from "staticTypes";
import { makeHtmlErr } from "./makeHtmlErr";
import { makeHtmlSuccess } from "./makeHtmlSuccess";
import { makeRegistrationPortal } from "./makeRegistrationPortal";

const lambda = new Lambda();

/**
 * Handles incoming events from the Discord bot.
 * @param {DiscordEventRequest} event The incoming request to handle.
 * @param {Context} _context The context this request was called with.
 * @param {Callback} _callback A callback to handle the request.
 * @return {DiscordEventResponse} Returns a response to send back to Discord.
 */
export async function handler(
  event: DiscordEventRequest,
  _context: Context,
  _callback: Callback
): Promise<DiscordEventResponse> {
  console.log(`Received event: ${JSON.stringify(event)}`);
  let routeCommand: RouteCommand = "";

  if (event.code) {
    routeCommand = "accessCode";
    // @ts-ignore
    return makeRegistrationPortal();
  } else if (event.json?.data?.channels && event.json?.data?.discordId) {
    routeCommand = "enableNewChannels";
  } else if (event.json?.data?.command === "kick") {
    routeCommand = "kick";
  } else if (event.json?.data?.command === "badge") {
    routeCommand = "badge";
  }

  const { apiKey } = JSON.parse(process.env.WIX_CREDENTIALS || "");

  if (
    (routeCommand === "enableNewChannels"
    || routeCommand === "kick"
    || routeCommand === "badge")
    && event.json?.data?.apiKey !== apiKey
  ) {
    // @ts-ignore
    return "<div>Invalid API Key</div>";
  }

  const lambdaPromise = lambda
    .invoke({
      FunctionName: commandLambdaARN,
      Payload: JSON.stringify({ ...event, routeCommand }),
      InvocationType: "RequestResponse"
    })
    .promise();

  const { Payload } = await lambdaPromise;

  console.log("this is the result of the command lambda");
  console.log(Payload?.toString());
  if (routeCommand === "accessCode" && Payload) {
    if (Payload.toString().indexOf("400") > -1) {
      const html = makeHtmlErr(Payload.toString());
      // @ts-ignore
      return html;
    } else {
      const html = makeHtmlSuccess(
        Payload.toString()
          .slice(1, -1)
          .replace("The Guild Patron,", "")
          .replace("The Guild,", "")
          .replace("The Guild Patron", "")
          .replace("The Guild", "")
      );
      // @ts-ignore
      return html;
    }
  } else {
    return {
      type: 9
    };
  }
}

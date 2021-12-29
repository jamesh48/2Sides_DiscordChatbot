/* eslint-disable operator-linebreak */
import { Lambda } from "aws-sdk";
import { Context, Callback } from "aws-lambda";
import { DiscordEventRequest, DiscordEventResponse } from "Types";
import { commandLambdaARN } from "./constants/EnvironmentProps";
import { RouteCommand } from "staticTypes";
import { makeHtmlErr } from "./makeHtmlErr";
import { makeHtmlSuccess } from "./makeHtmlSuccess";
// import { makeRegistrationPortal } from "./makeRegistrationPortal";

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
  } else if (event.json?.data?.channels && event.json?.data?.discordId) {
    routeCommand = "enableNewChannels";
  } else if (event.json?.data?.command === "kick") {
    routeCommand = "kick";
  } else if (event.json?.data?.command === "badge") {
    routeCommand = "badge";
  } else if (event.json?.data?.email && event.json?.data?.discordId) {
    routeCommand = "redeem";
  } else if (event.tempRandToken && event.email && event.discordId) {
    routeCommand = "verification";
  }

  const { apiKey } = JSON.parse(process.env.WIX_CREDENTIALS || "");

  if (
    (routeCommand === "enableNewChannels" ||
      routeCommand === "kick" ||
      routeCommand === "badge") &&
    event.json?.data?.apiKey !== apiKey
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
  console.log(Payload);

  if (routeCommand === "redeem" && Payload && event.json.data) {
    if (Payload.toString().indexOf("404") !== -1) {
      // @ts-ignore
      return (
        "The Email " +
        event.json.data.email +
        " was not found, are you sure you entered it correctly?"
      );
    } else if (Payload.toString().indexOf("400") > -1) {
      // @ts-ignore
      return "The email " + event.json.data.email + " is already registered";
    } else if (Payload.toString().indexOf("200") !== -1) {
      // @ts-ignore
      return (
        "An email has been sent to " +
        event.json.data.email +
        " to verify your Guild Subscription"
      );
    }
  }

  if ((routeCommand === "accessCode" || routeCommand === "verification") && Payload) {
    if (Array.isArray(JSON.parse(Payload.toString()))) {
      const [errMessage, discordId] = JSON.parse(Payload.toString());
      const html = makeHtmlErr(JSON.stringify(errMessage), JSON.stringify(discordId));
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

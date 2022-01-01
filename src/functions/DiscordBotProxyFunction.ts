/* eslint-disable operator-linebreak */
import { DiscordEventRequest, DiscordEventResponse } from "Types";
import { makeHtmlErr } from "./makeHtmlErr";
import { makeHtmlSuccess } from "./makeHtmlSuccess";
import {
  assignBadge,
  enableChannelAccess,
  enableNewChannelAccess,
  kickMember,
  redeem,
  registerAdditionalEmail
} from "lambda/lambdaServer/commands/commandIndex";
import { verifyUser } from "lambda/lambdaServer/commands/verifyUser/verifyUser";
import { routePath } from "./utils/router";
import { makeHtmlNeutral } from "./utils/makeHtmlNeutral";

export async function handler(event: DiscordEventRequest) {
  const [routeCommand, commandMethod, protectedRoute] = routePath(event);

  if (protectedRoute) {
    // The apiKey is necessary to secure any routes that WIX initiates.
    const { apiKey } = JSON.parse(process.env.WIX_CREDENTIALS || "");
    if (event.json?.data?.apiKey !== apiKey) {
      return "Invalid API Key";
    }
  }

  if (commandMethod === "GET") {
    if (routeCommand === "accessCode") {
      try {
        const [channelsGranted, discordId, registeredUsersEmail] =
          await enableChannelAccess(event.code);

        const discordIdStr = JSON.stringify(discordId);
        const registerUsersEmailStr = JSON.stringify(registeredUsersEmail);

        const htmlSuccessPage: DiscordEventResponse = makeHtmlSuccess(
          JSON.stringify(
            channelsGranted
              .replace("The Guild Patron,", "")
              .replace("The Guild,", "")
              .replace("The Guild Patron", "")
              .replace("The Guild", "")
          ),
          discordIdStr,
          registerUsersEmailStr
        );
        return htmlSuccessPage;
      } catch (err: any) {
        const [errMessage, discordId] = err.message.split("||");

        const errMessageStr = JSON.stringify(errMessage);
        const discordIdStr = JSON.stringify(discordId);

        if (errMessageStr.indexOf("404") !== -1) {
          const htmlNeutralPage: DiscordEventResponse = makeHtmlNeutral(
            errMessageStr,
            discordIdStr
          );
          return htmlNeutralPage;
        } else {
          // 400 or 500
          const htmlErrorPage: DiscordEventResponse = makeHtmlErr(errMessageStr);
          return htmlErrorPage;
        }
      }
    }
    // GET request from email verification link.
    // Accomplishes the same enableChannels given a tempRandToken.
    if (routeCommand === "verification") {
      try {
        const channelsGranted = await verifyUser(
          event.discordId,
          event.tempRandToken,
          event.email
        );

        const htmlSuccessPage: DiscordEventResponse = makeHtmlSuccess(
          JSON.stringify(
            channelsGranted
              .replace("The Guild Patron,", "")
              .replace("The Guild,", "")
              .replace("The Guild Patron", "")
              .replace("The Guild", "")
          ),
          JSON.stringify(event.discordId),
          JSON.stringify(event.email)
        );
        return htmlSuccessPage;
      } catch (err: any) {
        // These routes shouldn't run given that the verification was validated previously.
        const [errMessage, discordId] = err.message.split("||");
        const errMessageStr = JSON.stringify(errMessage);
        console.log(discordId);
        const htmlErrorPage: DiscordEventResponse = makeHtmlErr(errMessageStr);
        return htmlErrorPage;
      }
    }
  }

  if (commandMethod === "POST" && event.json.data) {
    // This Route is triggered by an WIX event, there is a data property
    if (routeCommand === "enableNewChannels") {
      await enableNewChannelAccess(event.json.data.discordId, event.json.data.channels);
      return "200";
    }

    // The Following two routes come from automations, so there is a "data" property
    if (routeCommand === "badge") {
      await assignBadge(event.json.data.email);
      return "200";
    }

    // This route
    if (routeCommand === "kick") {
      await kickMember(event.json.data.email.trim());
      return "200";
    }

    // POST request from error page, sends email with verification link.
    if (routeCommand === "redeem") {
      try {
        await redeem(event.json.data.email, event.json.data.discordId);
        return (
          "An email has been sent to " +
          event.json.data.email +
          " to verify your Guild Subscription"
        );
      } catch (err: any) {
        if (err.message.indexOf("404") !== -1) {
          return (
            "The Email " +
            event.json.data.email +
            " was not found, are you sure you entered it correctly?"
          );
        } else if (err.message.indexOf("400") !== -1) {
          return "The email " + event.json.data.email + " is already registered";
        } else {
          return "There was an unknown error";
        }
      }
    }

    if (routeCommand === "registerAdditionalEmail") {
      try {
        await registerAdditionalEmail(event.json.data.email, event.json.data.discordId);
        return `200 A verification email has been sent to ${event.json.data.email}`;
      } catch (err: any) {
        // Error message with 400 or 404 sent back to client.
        return err.message;
      }
    }
  }

  return "Server Error: 500";
}

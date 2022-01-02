/* eslint-disable operator-linebreak */
import { DiscordEventRequest, DiscordEventResponse } from "types/types";
import {
  makeHtmlErr,
  makeHtmlSuccess,
  makeHtmlNeutral
} from "./utils/registrationPortals/registrationPortalIndex";
import {
  assignBadge,
  enableChannelAccess,
  enableNewChannelAccess,
  kickMember,
  redeem,
  registerAdditionalEmail,
  verifyUser,
  sendAutomationFailAlert
} from "./utils/commands/commandIndex";

import { routePath } from "./utils/router";
import { makeRegistrationPortal } from "./utils/registrationPortals/makeRegistrationPortal";
import { getUserFromCode } from "./utils/commands/getUserFromCode/getUserFromCode";

export async function handler(event: DiscordEventRequest) {
  console.log(JSON.stringify(event));
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
        const [channelsGranted, discordId, registeredUsersEmail, registeredUsername] =
          await enableChannelAccess(event.code);

        const discordIdStr = JSON.stringify(discordId);
        const registerUsersEmailStr = JSON.stringify(registeredUsersEmail);
        const registeredUsernameStr = JSON.stringify(registeredUsername);

        const htmlSuccessPage: DiscordEventResponse = makeHtmlSuccess(
          JSON.stringify(
            channelsGranted
              .replace("The Guild Patron,", "")
              .replace("The Guild,", "")
              .replace("The Guild Patron", "")
              .replace("The Guild", "")
          ),
          JSON.stringify(""),
          discordIdStr,
          registerUsersEmailStr,
          JSON.stringify(""),
          registeredUsernameStr,
          false
        );
        return htmlSuccessPage;
      } catch (err: any) {
        const [errMessage, discordId, username, attemptedEmail] = err.message.split("||");

        const errMessageStr = JSON.stringify(errMessage);
        const discordIdStr = JSON.stringify(discordId);
        const usernameStr = JSON.stringify(username);
        const attemptedEmailStr = JSON.stringify(attemptedEmail);

        if (errMessageStr.indexOf("404") !== -1) {
          const htmlNeutralPage: DiscordEventResponse = makeHtmlNeutral(
            errMessageStr,
            discordIdStr,
            usernameStr,
            attemptedEmailStr
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
        const [verifiedUserProductArr, attemptedUserProductArr] = await verifyUser(
          event.discordId,
          event.tempRandToken,
          event.email,
          event.attemptedEmail
        );

        const htmlSuccessPage: DiscordEventResponse = makeHtmlSuccess(
          JSON.stringify(
            verifiedUserProductArr
              .replace("The Guild Patron,", "")
              .replace("The Guild,", "")
              .replace("The Guild Patron", "")
              .replace("The Guild", "")
          ),
          JSON.stringify(attemptedUserProductArr),
          JSON.stringify(event.discordId),
          JSON.stringify(event.email),
          JSON.stringify(event.attemptedEmail),
          JSON.stringify(""),
          true
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

    if (routeCommand === "registrationPortal") {
      const candidate = await getUserFromCode(event.code);
      return makeRegistrationPortal(
        JSON.stringify(candidate.id),
        JSON.stringify(candidate.username)
      );
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

    // POST request from Registration Portal page, sends email with verification link.
    if (routeCommand === "redeem") {
      try {
        await redeem(
          event.json.data.email,
          event.json.data.discordId,
          event.json.data.username,
          event.json.data.attemptedEmail
        );
        return (
          "An email has been sent to " +
          event.json.data.email +
          " to verify your Guild Subscription"
        );
      } catch (err: any) {
        return err.message;
      }
    }

    if (routeCommand === "registerAdditionalEmail") {
      try {
        await registerAdditionalEmail(
          event.json.data.email,
          event.json.data.discordId,
          event.json.data.username
        );
        return `200 A verification email has been sent to ${event.json.data.email}`;
      } catch (err: any) {
        // Error message with 400 or 404 sent back to client.
        return err.message;
      }
    }

    if (routeCommand === "automationFailAlert") {
      console.log("automation fail alert");
      await sendAutomationFailAlert(
        event.json.data.errMessage,
        event.json.data.errEmail,
        event.json.data.errDiscordID,
        event.json.data.errChannels,
        event.json.data.automationType
      );
    }
  }

  return "Server Error: 500";
}

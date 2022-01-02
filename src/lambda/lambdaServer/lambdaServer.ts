import {
  enableChannelAccess,
  enableNewChannelAccess,
  kickMember,
  assignBadge,
  redeem,
  registerAdditionalEmail
} from "./commands/commandIndex";

import { DiscordEventRequest } from "Types";
import { verifyUser } from "./commands/verifyUser/verifyUser";

exports.handler = async (event: DiscordEventRequest): Promise<string> => {
  console.log(JSON.stringify(event));
  const { routeCommand } = event;

  let commandMethod: string = "";

  if (routeCommand === "accessCode" || routeCommand === "verification") {
    commandMethod = "GET";
  } else if (event.json.data) {
    commandMethod = "POST";
  } else {
    throw new Error("No Valid Path");
  }

  console.log(`Executing ${commandMethod} ${routeCommand}`);

  // This Route is triggered by MFA link click.
  if (commandMethod === "GET") {
    if (routeCommand === "accessCode") {
      try {
        const [channelsGranted, discordId] = await enableChannelAccess(event.code);
        // @ts-ignore
        return [null, channelsGranted, discordId];
      } catch (err: any) {
        return err.message.split("||");
      }
    }
    // GET request from email verification link. Accomplishes the same enableChannels given a tempRandToken.
    if (routeCommand === "verification") {
      try {
        const channelsGranted = await verifyUser(
          event.discordId,
          event.tempRandToken,
          event.email
        );
        // @ts-ignore
        return [null, channelsGranted, event.discordId];
      } catch (err: any) {
        return err.message.split("||");
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
        await redeem(event.json.data.email, event.json.data.discordId, "");
        return "200";
      } catch (err: any) {
        return err.message;
      }
    }

    if (routeCommand === "registerAdditionalEmail") {
      try {
        await registerAdditionalEmail(
          event.json.data.email,
          event.json.data.discordId,
          ""
        );
      } catch (err: any) {
        return err.message;
      }
    }
  }

  return "500";
};

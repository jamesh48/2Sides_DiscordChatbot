import { Context, Callback } from "aws-lambda";

import {
  enableChannelAccess,
  enableNewChannelAccess,
  kickMember,
  assignBadge,
  redeem
} from "./commands/commandIndex";

import { DiscordEventRequest } from "Types";
import { verifyUser } from "./commands/verifyUser/verifyUser";

exports.handler = async (
  event: DiscordEventRequest,
  _context: Context,
  _callback: Callback
): Promise<string> => {
  console.log(JSON.stringify(event));

  console.log("Route Command->", event.routeCommand);

  // This Route is triggered by MFA link click.
  if (event.routeCommand === "accessCode") {
    try {
      const channelsGranted = await enableChannelAccess(event.code);
      return channelsGranted;
    } catch (err: any) {
      return err.message.split("||");
    }
  }

  // This Route is triggered by an WIX event, there is a data property
  if (event.routeCommand === "enableNewChannels" && event.json.data) {
    await enableNewChannelAccess(event.json.data.discordId, event.json.data.channels);
    return "200";
  }

  // The Following two routes come from automations, so there is a "data" property
  if (event.routeCommand === "badge" && event.json.data) {
    await assignBadge(event.json.data.email);
    return "200";
  }

  // This route
  if (event.routeCommand === "kick" && event.json.data) {
    await kickMember(event.json.data.email.trim());
    return "200";
  }

  // POST request from error page, sends email with verification link.
  if (event.routeCommand === "redeem" && event.json.data) {
    try {
      await redeem(event.json.data.email, event.json.data.discordId);
      return "200";
    } catch (err: any) {
      return err.message;
    }
  }

  // GET request from email verification link. Should accomplish the same as enableNewChannels.
  // A verification error would occur because:
  // the wix api key isn't provided. (Invalid Credentials)
  // the random token doesn't match ()
  // The redeemer function posts a random token on a user who has purchased a discord subscription.
  // There are no new products to register ?
  if (event.routeCommand === "verification") {
    try {
      const channelsGranted = await verifyUser(
        event.discordId,
        event.tempRandToken,
        event.email
      );
      return channelsGranted;
    } catch (err: any) {
      return err.message.split("||");
    }
  }

  return "200";
};

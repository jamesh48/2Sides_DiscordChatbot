import { Context, Callback } from "aws-lambda";

import {
  enableChannelAccess,
  enableNewChannelAccess,
  kickMember,
  assignBadge
} from "./commands/commandIndex";

import { DiscordEventRequest } from "Types";

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
    } catch (err) {
      // @ts-ignore
      console.log(err.response.status + ": " + err.response.data.error);
      // @ts-ignore
      return err.response.status + ": " + err.response.data.error;
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

  return "200";
};

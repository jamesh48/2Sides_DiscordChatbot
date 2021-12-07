import { Context, Callback } from "aws-lambda";
import response from "./responses/defaultResponse";
import errResponse from "./responses/defaultErrResponse";
import sendResponse from "./responses/sendRes";
import findChannelMember from "./utils/findChannelMember";
import {
  coinFlip,
  register,
  enableChannelAccess,
  revoke,
  enableNewChannelAccess,
  kickMember
} from "./commands/commandIndex";

import {
  DiscordEventRequest
  // DiscordResponseData,
} from "Types";
import sendErr from "./responses/sendErr";

exports.handler = async (
  event: DiscordEventRequest,
  _context: Context,
  _callback: Callback
): Promise<string> => {
  console.log(JSON.stringify(event));

  if (event.channels && event.discordId) {
    console.log("enabling new channels!");
    await enableNewChannelAccess(event.discordId, event.channels);
    return "200";
  }

  if (event.email && event.discordId && event.tempRandToken) {
    console.log("enabling channel access!");
    await enableChannelAccess(
      event.email,
      event.discordId,
      event.tempRandToken
    );
    return "200";
  }

  if (event.jsonBody?.data?.kick === "kick") {
    console.log("Kicking Member");
    await kickMember(event.jsonBody.data.email);
    return "200";
  }

  // Without the link Verify User is in the guild-------->
  try {
    if (event.jsonBody.user) {
      await findChannelMember(event.jsonBody.user.id);
    }
  } catch (err: any) {
    errResponse.content = err.response.data.message;
    event.jsonBody.token && (await sendErr(errResponse, event.jsonBody.token));
    return "404";
  }

  console.log("Verified Member from here--->");

  const incomingCommand = event.jsonBody.data?.name;
  console.log("executing command-> ", incomingCommand);
  switch (incomingCommand) {
    case "flip-coin":
      response.content = coinFlip();
      break;
    case "revoke":
      if (event.jsonBody.user && event.jsonBody.data?.options) {
        const discordId = event.jsonBody.user.id;
        const email = event.jsonBody.data?.options[0].value;
        console.log("before revoke", discordId, email);
        await revoke(discordId, email);
        response.content = "Revoked!";
      }
      break;
    case "enable-channel-access":
      if (event.jsonBody.user && event.jsonBody.data?.options) {
        const discordId = event.jsonBody.user.id;
        const email = event.jsonBody.data.options[0].value;
        const username = event.jsonBody.user.username;

        try {
          const channelsToJoin = await register(email, discordId, username);
          // TODO- change to be inclusive of Guild Membership only folks as well.
          if (!channelsToJoin) {
            response.content =
              "I've sent you an email, with a link to secure your access to the Guild!";
          } else {
            response.content = `I've sent you an email, with a link to secure your access to the Guild as well as these exclusive channels: ${channelsToJoin}`;
          }
        } catch (err) {
          // @ts-ignore
          response.content = err.message;
        }
      }
      break;
    default:
      response.content = "Command Not Found";
      break;
  }
  if (
    event.jsonBody.token &&
    (await sendResponse(response, event.jsonBody.token))
  ) {
    console.log("Responded successfully!");
  } else {
    console.log("Failed to send response!");
  }
  return "200";
};

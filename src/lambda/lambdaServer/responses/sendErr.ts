import axios from "axios";
import { DiscordResponseData } from "Types";

export default async function sendErr(
  errResponse: DiscordResponseData,
  interactionToken: string
) {
  // @ts-ignore, undefined only in local env
  // prettier-ignore
  const { discordClientID, discordAuthToken } = JSON.parse(process.env.DISCORD_CREDENTIALS);

  const url = `https://discord.com/api/v8/webhooks/${discordClientID}/${interactionToken}`;
  const authConfig = {
    headers: {
      Authorization: discordAuthToken
    }
  };
  return (await axios.post(url, errResponse, authConfig)).status == 200;
}

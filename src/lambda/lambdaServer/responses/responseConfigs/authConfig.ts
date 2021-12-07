import { AxiosRequestConfig } from "axios";
import { DiscordResponseData } from "Types";

export const authConfig = (
  interactionToken: string,
  response: DiscordResponseData
) => {
  // @ts-ignore, undefined only in local env
  // prettier-ignore
  const { discordClientID, discordAuthToken } = JSON.parse(process.env.DISCORD_CREDENTIALS);

  const authConfig: AxiosRequestConfig = {
    method: "POST",
    url: `https://discord.com/api/v8/webhooks/${discordClientID}/${interactionToken}`,
    headers: {
      Authorization: discordAuthToken
    },
    data: response
  };

  return authConfig;
};

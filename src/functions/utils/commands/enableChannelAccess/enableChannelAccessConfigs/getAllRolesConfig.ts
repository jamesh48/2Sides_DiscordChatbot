import { AxiosRequestConfig } from "axios";
export const getAllRolesConfig = () => {
  // @ts-ignore, undefined only in local env
  // prettier-ignore
  const { discordGuildID, discordAuthToken } = JSON.parse(process.env.DISCORD_CREDENTIALS);
  // Request Discord for All Channels...
  const getAllRolesConfig: AxiosRequestConfig = {
    method: "GET",
    url: `https://discord.com/api/v8/guilds/${discordGuildID}/roles`,
    headers: {
      Authorization: discordAuthToken
    }
  };

  return getAllRolesConfig;
};

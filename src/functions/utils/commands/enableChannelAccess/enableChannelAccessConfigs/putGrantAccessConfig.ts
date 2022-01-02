import { AxiosRequestConfig } from "axios";
import { DiscordId, DiscordRoleId } from "types/staticTypes";

export const putGrantAccessConfig = (discordUserId: DiscordId, roleID: DiscordRoleId) => {
  // @ts-ignore, undefined only in local env
  // prettier-ignore
  const { discordAuthToken, discordGuildID } = JSON.parse(process.env.DISCORD_CREDENTIALS);

  const grantAccessConfig: AxiosRequestConfig = {
    method: "PUT",
    url: `https://discord.com/api/v8/guilds/${discordGuildID}/members/${discordUserId}/roles/${roleID}`,
    headers: {
      "Content-Type": "application/json",
      // prettier-ignore
      "Authorization": discordAuthToken
    }
  };

  return grantAccessConfig;
};

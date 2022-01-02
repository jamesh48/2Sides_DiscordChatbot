import { AxiosRequestConfig } from "axios";
import { DiscordId, UserEmail } from "types/staticTypes";

export const getGuildMembershipConfig = (userEmail: UserEmail, discordId: DiscordId) => {
  // @ts-ignore, only undefined in local env
  const wixWebsiteName = JSON.parse(process.env.WIX_CREDENTIALS)["wixWebsiteName"];

  // @ts-ignore, only undefined in local env
  const wixAPIKey = JSON.parse(process.env.WIX_CREDENTIALS)["wixAPIKey"];

  const getGuildMembershipConfig: AxiosRequestConfig = {
    url: `${wixWebsiteName}/_functions/guildMembership?email=${userEmail}&discordId=${discordId}`,
    headers: {
      Authorization: wixAPIKey
    }
  };

  return getGuildMembershipConfig;
};

import { AxiosRequestConfig } from "axios";

export const getGuildMembershipConfig = (
  userEmail: string,
  discordId: string,
  tempRandToken: string
) => {
  // @ts-ignore, only undefined in local env
  const wixWebsiteName = JSON.parse(process.env.WIX_CREDENTIALS)[
    "wixWebsiteName"
  ];

  // @ts-ignore, only undefined in local env
  const wixAPIKey = JSON.parse(process.env.WIX_CREDENTIALS)["wixAPIKey"];

  const getGuildMembershipConfig: AxiosRequestConfig = {
    url: `${wixWebsiteName}/_functions/guildMembership?email=${userEmail}&discordId=${discordId}&tempRandToken=${tempRandToken}`,
    headers: {
      Authorization: wixAPIKey
    }
  };

  return getGuildMembershipConfig;
};

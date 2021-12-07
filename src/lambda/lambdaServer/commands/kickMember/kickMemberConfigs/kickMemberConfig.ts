import { AxiosRequestConfig } from "axios";
export const kickMemberConfig = (discordID: string) => {
  const {
    discordAuthToken,
    discordGuildID
    // @ts-ignore, undefined only in local env
  } = JSON.parse(process.env.DISCORD_CREDENTIALS);

  const kickMemberConfig: AxiosRequestConfig = {
    method: "DELETE",
    url: `https://discord.com/api/v8/guilds/${discordGuildID}/members/${discordID}`,
    headers: {
      Authorization: discordAuthToken
    }
  };

  return kickMemberConfig;
};

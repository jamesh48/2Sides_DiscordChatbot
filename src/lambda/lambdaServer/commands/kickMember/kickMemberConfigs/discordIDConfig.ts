import { AxiosRequestConfig } from "axios";

export const discordIDConfig = (memberEmail: string) => {
  // @ts-ignore
  const { wixWebsiteName, wixAPIKey } = JSON.parse(process.env.WIX_CREDENTIALS);
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${wixWebsiteName}/_functions/usersDiscordId`,
    params: { email: memberEmail },
    headers: {
      Authorization: wixAPIKey
    }
  };
  return config;
};

import { AxiosRequestConfig } from "axios";
import { UserEmail } from "staticTypes";

export const discordIDConfig = (memberEmail: UserEmail) => {
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

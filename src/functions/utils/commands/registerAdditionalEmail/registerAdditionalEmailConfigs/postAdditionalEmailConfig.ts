import { AxiosRequestConfig } from "axios";
import { DiscordId, UserEmail } from "types/staticTypes";

export const postAdditionalEmailConfig = (email: UserEmail, discordId: DiscordId) => {
  // @ts-ignore
  const { wixWebsiteName, wixAPIKey } = JSON.parse(process.env.WIX_CREDENTIALS);

  const postAdditionalEmail: AxiosRequestConfig = {
    url: `${wixWebsiteName}/_functions/additionalEmail`,
    method: "POST",
    params: { email, discordId },
    headers: {
      Authorization: wixAPIKey
    }
  };
  return postAdditionalEmail;
};

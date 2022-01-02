import { AxiosRequestConfig } from "axios";
import { DiscordId, UserEmail } from "types/staticTypes";

export const getUsersRegisteredProductsConfig = (
  candidateUserID: DiscordId,
  candidateUserEmail: UserEmail
) => {
  // @ts-ignore
  const { wixWebsiteName, wixAPIKey } = JSON.parse(process.env.WIX_CREDENTIALS);

  const getUsersRegisteredProductsConfig: AxiosRequestConfig = {
    method: "GET",
    url: `${wixWebsiteName}/_functions/usersRegisteredProducts`,
    params: { discordId: candidateUserID, email: candidateUserEmail },
    headers: {
      Authorization: wixAPIKey
    }
  };
  return getUsersRegisteredProductsConfig;
};

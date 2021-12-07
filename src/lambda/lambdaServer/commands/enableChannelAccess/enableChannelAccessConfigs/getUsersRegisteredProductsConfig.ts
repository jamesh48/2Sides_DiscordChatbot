import { AxiosRequestConfig } from "axios";

export const getUsersRegisteredProductsConfig = (
  userEmail: string,
  discordId: string,
  tempRandToken: string
) => {
  // @ts-ignore, only undefined in local env
  const { wixAPIKey, wixWebsiteName } = JSON.parse(process.env.WIX_CREDENTIALS);

  const getUsersRegisteredProductsConfig: AxiosRequestConfig = {
    url: `${wixWebsiteName}/_functions/usersRegisteredProducts?email=${userEmail}&discordId=${discordId}&tempRandToken=${tempRandToken}`,
    headers: {
      Authorization: wixAPIKey
    }
  };

  return getUsersRegisteredProductsConfig;
};

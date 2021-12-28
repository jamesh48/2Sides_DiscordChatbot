import { AxiosRequestConfig } from "axios";

export const randTokenConfig = (email: string) => {
  // @ts-ignore, only undefined in local env
  const { wixAPIKey, wixWebsiteName } = JSON.parse(process.env.WIX_CREDENTIALS);
  const randTokenConfig: AxiosRequestConfig = {
    method: "POST",
    url: `${wixWebsiteName}/_functions/randomToken?email=${email}`,
    headers: {
      Authorization: wixAPIKey
    }
  };
  return randTokenConfig;
};

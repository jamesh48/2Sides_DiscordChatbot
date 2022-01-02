import { AxiosRequestConfig } from "axios";
import { UserEmail } from "types/staticTypes";

export const redeemConfig = (email: UserEmail, attemptedEmail: UserEmail) => {
  // @ts-ignore
  const { wixWebsiteName, wixAPIKey } = JSON.parse(process.env.WIX_CREDENTIALS);

  const redeemConfig: AxiosRequestConfig = {
    method: "POST",
    url: `${wixWebsiteName}/_functions/randomToken`,
    params: {
      email,
      attemptedEmail
    },
    headers: {
      Authorization: wixAPIKey
    }
  };
  return redeemConfig;
};

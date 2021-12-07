import axios, { AxiosRequestConfig } from "axios";

export const revokeGuildAccessInWix = async (
  userEmail: string,
  discordId: string
) => {
  // @ts-ignore, only undefined in local env
  const { wixAPIKey, wixWebsiteName } = JSON.parse(process.env.WIX_CREDENTIALS);

  const revokeGuildAccessConfig: AxiosRequestConfig = {
    method: "POST",
    url: `${wixWebsiteName}/_functions/revokeGuildAccess?email=${userEmail}&discordId=${discordId}`,
    headers: {
      authorization: wixAPIKey
    }
  };

  try {
    await axios(revokeGuildAccessConfig);
  } catch (err) {
    // @ts-ignore
    throw new Error(err.message);
  }
};

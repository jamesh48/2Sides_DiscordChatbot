import { DiscordAccessToken, DiscordTokenType } from "types/staticTypes";

export const getUserParams = (
  tokenType: DiscordTokenType,
  accessToken: DiscordAccessToken
) => {
  const getUserParams = {
    headers: {
      authorization: `${tokenType} ${accessToken}`
    }
  };
  return getUserParams;
};

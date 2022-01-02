import { CodeFromDiscord } from "types/staticTypes";
import { URLSearchParams } from "url";

export const getAccessCodeParams = (code: CodeFromDiscord) => {
  const {
    discordClientID,
    discordClientSecret
    // @ts-ignore, undefined only in local env
  } = JSON.parse(process.env.DISCORD_CREDENTIALS);

  // @ts-ignore, undefined only in local env
  const { APIGatewayURL } = JSON.parse(process.env.SECRET_URLS);
  const getAccessCodeParams = new URLSearchParams({
    client_id: discordClientID,
    client_secret: discordClientSecret,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: APIGatewayURL,
    scope: "email"
  });

  return getAccessCodeParams.toString();
};

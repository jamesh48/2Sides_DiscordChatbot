import { DiscordChannelsStr, DiscordId, UserEmail } from "staticTypes";
import { redeemEmailTemplate } from "./redeemEmailTemplate";

export const sendValidationEmail = async (
  _to: UserEmail,
  discordChannels: DiscordChannelsStr,
  tempRandToken: string,
  discordId: DiscordId
) => {
  const sgMail = require("@sendgrid/mail");
  // @ts-ignore, only undefined in local dev
  const sendGridApiKey = JSON.parse(process.env.SENDGRID_API_KEY)["sendgrid-api-key"];
  sgMail.setApiKey(sendGridApiKey);

  const outboundEmail = {
    to: _to,
    from: "dannygoldsmithmagic@gmail.com",
    subject: "Please Verify Your Email with Danny Goldsmith Magic",
    html: redeemEmailTemplate(_to, discordChannels, tempRandToken, discordId)
  };

  await sgMail.send(outboundEmail);
};

import { DiscordChannelsStr, DiscordId, UserEmail } from "staticTypes";
import { automationFailAlertTemplate } from "./sendAutomationFailUtils/automationFailAlertTemplate";

export const sendAutomationFailAlert = async (
  errMessage: string,
  errEmail: UserEmail,
  errDiscordID: DiscordId,
  errChannels: DiscordChannelsStr,
  automationType: string
) => {
  const sgMail = require("@sendgrid/mail");
  // @ts-ignore
  const sendGridApiKey = JSON.parse(process.env.SENDGRID_API_KEY)["sendgrid-api-key"];
  sgMail.setApiKey(sendGridApiKey);

  const outboundAutomationFailAlertEmail = {
    to: "james@fullstackhrivnak.com",
    from: "dannygoldsmithmagic@gmail.com",
    subject: "There was an Automation Fail",
    html: automationFailAlertTemplate(
      errMessage,
      errEmail,
      errDiscordID,
      errChannels,
      automationType
    )
  };

  await sgMail.send(outboundAutomationFailAlertEmail);
};

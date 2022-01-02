import { UserEmail } from "types/staticTypes";
import { kickEmailTemplate } from "./kickEmailTemplate";

const sendKickEmail = async function (_to: UserEmail) {
  const sgMail = require("@sendgrid/mail");
  // @ts-ignore, only undefined in local dev
  const sendGridApiKey = JSON.parse(process.env.SENDGRID_API_KEY)["sendgrid-api-key"];
  sgMail.setApiKey(sendGridApiKey);

  const outboundEmail = {
    to: _to,
    from: "dannygoldsmithmagic@gmail.com",
    subject: "Discord Guild Membership Cancelled",
    html: kickEmailTemplate(_to)
  };

  sgMail.send(outboundEmail);
};

export default sendKickEmail;

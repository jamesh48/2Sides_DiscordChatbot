import { emailTemplate } from "./emailTemplate";

const sendEmail = async function (
  _to: string,
  validationLink: string,
  channelsToJoin: string,
  username: string
) {
  const sgMail = require("@sendgrid/mail");
  // @ts-ignore, only undefined in local dev
  const sendGridApiKey = JSON.parse(process.env.SENDGRID_API_KEY)[
    "sendgrid-api-key"
  ];
  sgMail.setApiKey(sendGridApiKey);

  const _subject = "Verify your email with the Danny Goldsmith Magic Discord!";
  const outboundEmail = {
    to: _to,
    from: "dannygoldsmithmagic@gmail.com",
    subject: _subject,
    html: emailTemplate(validationLink, channelsToJoin, username)
  };

  sgMail.send(outboundEmail);
};

export default sendEmail;

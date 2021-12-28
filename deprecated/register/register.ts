import axios from "axios";
import sendEmail from "./registerUtils/sendGridUtil";
import { randTokenConfig } from "./registerConfigs/randTokenConfig";
import { validationLink } from "./registerConfigs/validationLink";

export async function register(
  email: string,
  discordId: string,
  username: string
) {
  try {
    const {
      data: { tempRandToken, channelsToJoin }
    } = await axios(randTokenConfig(email));

    await sendEmail(
      email,
      validationLink(discordId, email, tempRandToken),
      channelsToJoin,
      username
    );
    return channelsToJoin;
  } catch ({
    message
    ,
    // This error is a validation error from WIX.
    response: {
      data: { error } = {}
    } = {}
  }) {
    // @ts-ignore
    throw new Error(`${message}: ${error || "Unknown Reason"}`);
  }
}

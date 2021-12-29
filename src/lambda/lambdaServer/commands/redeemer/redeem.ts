import axios, { AxiosResponse } from "axios";
import { DiscordId } from "staticTypes";
import { sendValidationEmail } from "./redeemerUtils/sendValidationEmail";
import { redeemConfig } from "./reedeemerConfigs/reedemConfig";

export const redeem = async (email: string, discordId: DiscordId) => {
  try {
    // Post Random Token, potential channels and randToken are sent back;
    // eslint-disable-next-line no-var
    var { data }: AxiosResponse = await axios(redeemConfig(email));
  } catch (err: any) {
    throw new Error(err.response.status + ": " + err.response.data.error);
  }
  // Send Email with random token in hyperlink.
  await sendValidationEmail(email, data.channelsToJoin, data.tempRandToken, discordId);
  return data;
};

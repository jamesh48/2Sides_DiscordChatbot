import axios from "axios";
import { DiscordId, UserEmail, Username } from "types/staticTypes";
import { sendAddUserEmail } from "./registerAdditionalEmailUtils/sendAddUserEmail";
import { postAdditionalEmailConfig } from "./registerAdditionalEmailConfigs/postAdditionalEmailConfig";

export const registerAdditionalEmail = async (
  email: UserEmail,
  discordId: DiscordId,
  username: Username
) => {
  try {
    // eslint-disable-next-line no-var
    var { data } = await axios(postAdditionalEmailConfig(email, discordId));
  } catch (err: any) {
    // Only the message needs to be sent back to the client.
    throw new Error(err.response.data.error);
  }

  // Send Email with random token in hyperlink.
  await sendAddUserEmail(
    email,
    data.channelsToJoin,
    data.tempRandToken,
    discordId,
    username
  );
  return data;
};

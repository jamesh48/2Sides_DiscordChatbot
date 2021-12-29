import axios from "axios";
import { DiscordChannel } from "staticTypes";
import { deleteNewUserRoleConfig } from "../enableChannelAccess/enableChannelAccessConfigs/deleteNewUserRoleConfig";
import { putMemberRoleConfig } from "../enableChannelAccess/enableChannelAccessConfigs/putMemberRoleConfig";
import { grantAccessToPrivateChannels } from "../enableChannelAccess/enableChannelAccessUtils/grantAccessToPrivateChannels";
export const verifyUser = async (
  discordId: string,
  tempRandToken: string,
  email: string
) => {
  // @ts-ignore
  const { wixWebsiteName, wixAPIKey } = JSON.parse(process.env.WIX_CREDENTIALS);

  try {
    // eslint-disable-next-line no-var
    var { data } = await axios({
      method: "POST",
      url: `${wixWebsiteName}/_functions/verifyUser`,
      params: {
        discordId,
        tempRandToken,
        email
      },
      headers: {
        Authorization: wixAPIKey
      }
    });
  } catch (err: any) {
    throw new Error(
      err.response.status + ": " + err.response.data.error + "||" + discordId
    );
  }

  await axios(putMemberRoleConfig(discordId));
  await axios(deleteNewUserRoleConfig(discordId));

  const purchasedProductsJoined = data.message
    .map((channel: DiscordChannel) => channel.toLowerCase())
    .join(" ");

  await grantAccessToPrivateChannels(discordId, purchasedProductsJoined);

  return data.message.join(", ");
};

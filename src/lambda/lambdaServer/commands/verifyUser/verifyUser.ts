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

  // Todo: run get request to check if role exists already.
  if (data.message.join(", ").indexOf("The Guild") > -1) {
    await axios(putMemberRoleConfig(discordId));
    await axios(deleteNewUserRoleConfig(discordId));
  }
  console.log("permissions successfully changed");
  console.log(data.message);
  console.log(typeof data.message);
  console.log(Array.isArray(data.message));
  const purchasedProductsJoined = data.message
    .map((channel: DiscordChannel) => channel.toLowerCase())
    .join(" ");
  console.log(purchasedProductsJoined);
  console.log(typeof purchasedProductsJoined);
  console.log("granting access to private channels");
  try {
    await grantAccessToPrivateChannels(discordId, purchasedProductsJoined);
  } catch (err: any) {
    console.log(err.message);
    throw new Error(err.message);
  }
  console.log("access granted to private channels successfully");

  return data.message.join(", ");
};

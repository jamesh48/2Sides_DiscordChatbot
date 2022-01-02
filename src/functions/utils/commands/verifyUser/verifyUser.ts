/* eslint-disable operator-linebreak */
import axios from "axios";
import { DiscordChannel, DiscordId, TempRandToken, UserEmail } from "types/staticTypes";
import { deleteNewUserRoleConfig } from "../enableChannelAccess/enableChannelAccessConfigs/deleteNewUserRoleConfig";
import { putMemberRoleConfig } from "../enableChannelAccess/enableChannelAccessConfigs/putMemberRoleConfig";
import { grantAccessToPrivateChannels } from "../enableChannelAccess/enableChannelAccessUtils/grantAccessToPrivateChannels";
export const verifyUser = async (
  discordId: DiscordId,
  tempRandToken: TempRandToken,
  email: UserEmail,
  attemptedEmail: UserEmail
) => {
  // @ts-ignore
  const { wixWebsiteName, wixAPIKey } = JSON.parse(process.env.WIX_CREDENTIALS);

  try {
    // eslint-disable-next-line no-var
    var {
      data
    }: { data: { verifiedUserProductArr: string[]; attemptedUserProductArr: string[] } } =
      await axios({
        method: "POST",
        url: `${wixWebsiteName}/_functions/verifyUser`,
        params: {
          discordId,
          tempRandToken,
          email,
          attemptedEmail
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

  console.log(
    "verifiedUserProductArr",
    data.verifiedUserProductArr,
    Array.isArray(data.verifiedUserProductArr)
  );
  console.log(
    "attemptedUserProductArr",
    data.attemptedUserProductArr,
    Array.isArray(data.attemptedUserProductArr)
  );

  // Todo: run get request to check if role exists already.
  if (data.verifiedUserProductArr.join(", ").indexOf("The Guild") > -1) {
    await axios(putMemberRoleConfig(discordId));
    await axios(deleteNewUserRoleConfig(discordId));
  }

  const totalProducts: string[] = [
    ...data.verifiedUserProductArr,
    ...data.attemptedUserProductArr
  ];

  console.log("TOTAL PRODUCTS", totalProducts, Array.isArray(totalProducts));

  const purchasedProductsJoined = totalProducts
    .map((channel: DiscordChannel) => channel.toLowerCase())
    .join(" ");

  try {
    await grantAccessToPrivateChannels(discordId, purchasedProductsJoined);
  } catch (err: any) {
    console.log(err.message);
    throw new Error(err.message);
  }
  console.log("access granted to private channels successfully");

  return [
    data.verifiedUserProductArr.join(", "),
    data.attemptedUserProductArr.join(", ")
  ];
};

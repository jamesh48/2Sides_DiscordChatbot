import axios from "axios";
import { getUsersRegisteredProductsConfig } from "./enableChannelAccessConfigs/getUsersRegisteredProductsConfig";
import { grantAccessToPrivateChannels } from "./enableChannelAccessUtils/grantAccessUtilsIndex";
import { putMemberRoleConfig } from "./enableChannelAccessConfigs/putMemberRoleConfig";
import { deleteNewUserRoleConfig } from "./enableChannelAccessConfigs/deleteNewUserRoleConfig";

export async function enableChannelAccess(
  userEmail: string,
  discordId: string,
  tempRandToken: string
) {
  // Todo-> Test if email matches purchased paid plan before the following logic.

  // Changes the role from New User to Member--->
  await axios(putMemberRoleConfig(discordId));
  await axios(deleteNewUserRoleConfig(discordId));
  // ------------------------------------------>

  const {
    data: { message: purchasedProductArr }
  } = await axios(
    getUsersRegisteredProductsConfig(userEmail, discordId, tempRandToken)
  );

  if (purchasedProductArr.length) {
    const purchasedProductsToLowerCase = purchasedProductArr.map(
      (purchasedProductName: string) => purchasedProductName.toLowerCase()
    );

    await grantAccessToPrivateChannels(discordId, purchasedProductsToLowerCase);
  }
}

export default enableChannelAccess;

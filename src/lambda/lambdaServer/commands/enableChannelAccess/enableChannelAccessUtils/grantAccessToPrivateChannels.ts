import axios, { AxiosResponse } from "axios";
import {
  DiscordChannelsStr,
  DiscordId,
  DiscordRoleId,
  DiscordRoleName
} from "staticTypes";
import {
  getAllRolesConfig,
  putGrantAccessConfig
} from "../enableChannelAccessConfigs/_enableChannelAccessConfigIndex";

// Only Discord Calls in this helper Function
export const grantAccessToPrivateChannels = async (
  discordUserId: DiscordId,
  purchasedProductsJoined: DiscordChannelsStr
) => {
  /* -----> Gets all Potential Discord Roles <----- */
  const { data: currentDiscordRoles }: AxiosResponse = await axios(getAllRolesConfig());

  /* -----> If the Purchased Product Matches, grant access to Exclusive Rooms <----- */
  await currentDiscordRoles.reduce(
    async (
      promise: Promise<null>,
      role: { name: DiscordRoleName; id: DiscordRoleId }
    ) => {
      await promise;
      if (purchasedProductsJoined.indexOf(role.name.toLowerCase()) > -1) {
        await axios(putGrantAccessConfig(discordUserId, role.id));
      }
    },
    Promise.resolve()
  );
};

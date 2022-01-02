import { DiscordChannelsStr, DiscordId } from "types/staticTypes";
import { grantAccessToPrivateChannels } from "./enableChannelAccessUtils/grantAccessToPrivateChannels";

export const enableNewChannelAccess = async (
  discordId: DiscordId,
  discordChannelsStr: DiscordChannelsStr
) => {
  const purchasedProductsJoined = discordChannelsStr.toLowerCase();
  await grantAccessToPrivateChannels(discordId, purchasedProductsJoined);
};

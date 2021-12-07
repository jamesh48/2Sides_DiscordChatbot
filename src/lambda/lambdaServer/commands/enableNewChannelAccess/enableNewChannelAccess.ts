import { grantAccessToPrivateChannels } from "../enableChannelAccess/enableChannelAccessUtils/grantAccessToPrivateChannels";

export async function enableNewChannelAccess(
  discordId: string,
  channels: string[]
) {
  await grantAccessToPrivateChannels(discordId, channels);
}



import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
export const revokeAccessToAllPrivateChannels = async (discordId: string) => {
  // First Revoke Access to Channels on Discord Side
  const purchasedProductArr = ["mythos", "homage", "modus"];
  try {
    // @ts-ignore, undefined only in local env
    // prettier-ignore
    const { discordAuthToken, discordGuildID } = JSON.parse(process.env.DISCORD_CREDENTIALS);

    // Request Discord for All Channels...
    const getAllChannelsConfig: AxiosRequestConfig = {
      method: "GET",
      url: `https://discord.com/api/v8/guilds/${discordGuildID}/channels`,
      headers: {
        Authorization: discordAuthToken
      }
    };

    const { data: currentDiscordChannels }: AxiosResponse = await axios(
      getAllChannelsConfig
    );

    type Channel = {
      id: string;
      name: string;
    };

    const reduced = currentDiscordChannels.reduce(
      (reducedArr: Channel[], channel: Channel) => {
        reducedArr.push({ id: channel.id, name: channel.name });
        return reducedArr;
      },
      []
    );

    await reduced.reduce(
      async (promise: any, channel: { name: string; id: any }) => {
        await promise;
        if (purchasedProductArr.indexOf(channel.name) > -1) {
          const grantAccessConfig: AxiosRequestConfig = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // prettier-ignore
              "Authorization": discordAuthToken
            },
            url: `https://discord.com/api/v8/channels/${channel.id}/permissions/${discordId}`,
            data: JSON.stringify({ deny: 1024, type: 1 })
          };
          await axios(grantAccessConfig);
        }
      },
      Promise.resolve()
    );
  } catch (err) {
    // @ts-ignore
    console.log(err.message);
  }
};

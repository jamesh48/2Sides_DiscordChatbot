import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Only Discord Calls in this helper Function
export const grantAccessToPrivateChannels = async (
  discordUserId: string,
  purchasedProductArr: string[]
) => {
  // @ts-ignore, undefined only in local env
  // prettier-ignore
  const { discordGuildID, discordAuthToken } = JSON.parse(process.env.DISCORD_CREDENTIALS);

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
  const reducedChannels = currentDiscordChannels.reduce(
    (reducedArr: Channel[], channel: Channel) => {
      reducedArr.push({ id: channel.id, name: channel.name });
      return reducedArr;
    },
    []
  );

  await reducedChannels.reduce(
    async (promise: any, channel: { name: string; id: any }) => {
      await promise;
      if (purchasedProductArr.indexOf(channel.name.toLowerCase()) > -1) {
        const grantAccessConfig: AxiosRequestConfig = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // prettier-ignore
            "Authorization": discordAuthToken
          },
          url: `https://discord.com/api/v8/channels/${channel.id}/permissions/${discordUserId}`,
          // https://discordapi.com/permissions.html
          data: JSON.stringify({ allow: 519727205952, type: 1 })
        };
        await axios(grantAccessConfig);
      }
    },
    Promise.resolve()
  );
};

import axios from "axios";
export default async function findChannelMember(
  memberQueryId: string | undefined
) {
  // @ts-ignore, undefined only in local env
  // prettier-ignore
  const { discordGuildID, discordAuthToken } = JSON.parse(process.env.DISCORD_CREDENTIALS);

  const findChannelMemberConfig = {
    url: `https://discord.com/api/v8/guilds/${discordGuildID}/members/${memberQueryId}`,
    headers: {
      Authorization: discordAuthToken
    }
  };

  const { data } = await axios(findChannelMemberConfig);
  return data;
}

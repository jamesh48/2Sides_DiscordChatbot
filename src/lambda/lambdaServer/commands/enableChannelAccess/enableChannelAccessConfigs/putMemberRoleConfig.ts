import { AxiosRequestConfig } from "axios";

export const putMemberRoleConfig = (discordId: string) => {
  const {
    discordAuthToken,
    discordGuildID,
    roleIDs: { memberRoleID }
    // @ts-ignore, undefined only in local env
  } = JSON.parse(process.env.DISCORD_CREDENTIALS);

  // GuildId<-->discordId<-->RoleId.
  const putMemberRoleConfig: AxiosRequestConfig = {
    method: "PUT",
    url: `https://discord.com/api/v8/guilds/${discordGuildID}/members/${discordId}/roles/${memberRoleID}`,
    headers: {
      Authorization: discordAuthToken
    }
  };

  return putMemberRoleConfig;
};

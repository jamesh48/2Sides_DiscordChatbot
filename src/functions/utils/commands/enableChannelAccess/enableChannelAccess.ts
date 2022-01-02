/* eslint-disable operator-linebreak */
import axios, { AxiosResponse } from "axios";
import { grantAccessToPrivateChannels } from "./enableChannelAccessUtils/grantAccessUtilsIndex";

import {
  putMemberRoleConfig,
  deleteNewUserRoleConfig,
  getUsersRegisteredProductsConfig
} from "./enableChannelAccessConfigs/_enableChannelAccessConfigIndex";

import { getAccessCodeParams, getUserParams } from "./authConfigs/authConfigIndex";

import { CodeFromDiscord, DiscordChannel } from "types/staticTypes";

export async function enableChannelAccess(code: CodeFromDiscord) {
  // Get Access Code
  const { data: oAuthData } = await axios.post(
    "https://discord.com/api/oauth2/token",
    getAccessCodeParams(code)
  );

  // Get User from Access Code
  const { data: candidateUser } = await axios(
    "https://discord.com/api/users/@me",
    getUserParams(oAuthData.token_type, oAuthData.access_token)
  );

  // With users email and discordID, get their registered products from wix
  try {
    // eslint-disable-next-line no-var
    var {
      data: { message }
    }: AxiosResponse = await axios(
      getUsersRegisteredProductsConfig(candidateUser.id, candidateUser.email)
    );
  } catch (err: any) {
    throw new Error(
      err.response.status +
        ": " +
        err.response.data.error +
        "||" +
        candidateUser.id +
        "||" +
        candidateUser.username +
        "||" +
        candidateUser.email
    );
  }

  /* -----> Change the role from New User to Member <----- */
  await axios(putMemberRoleConfig(candidateUser.id));
  await axios(deleteNewUserRoleConfig(candidateUser.id));

  const purchasedProductsJoined = message
    .map((channel: DiscordChannel) => channel.toLowerCase())
    .join(" ");

  await grantAccessToPrivateChannels(candidateUser.id, purchasedProductsJoined);

  return [
    message.join(", "),
    candidateUser.id,
    candidateUser.email,
    candidateUser.username
  ];
}

export default enableChannelAccess;

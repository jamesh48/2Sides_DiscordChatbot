import axios, { AxiosResponse } from "axios";
import { UserEmail } from "staticTypes";

import {
  discordIDConfig,
  kickMemberConfig
} from "./kickMemberConfigs/kickMemberConfigIndex";

import sendKickEmail from "./kickMemberUtils/sendKickEmail";

export const kickMember = async (memberEmail: UserEmail) => {
  /* Get DiscordID from WIX, this also deletes Guild Purchased Row in WIX */
  const {
    data: { message: discordID }
  }: AxiosResponse = await axios(discordIDConfig(memberEmail));

  /* Kick Member from Guild */
  await axios(kickMemberConfig(discordID));

  await sendKickEmail(memberEmail);
};

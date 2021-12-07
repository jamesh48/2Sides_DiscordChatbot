import axios, { AxiosResponse } from "axios";
import {
  discordIDConfig,
  kickMemberConfig
} from "./kickMemberConfigs/kickMemberConfigIndex";

export const kickMember = async (memberEmail: string) => {
  const {
    data: { message: discordID }
  }: AxiosResponse = await axios(discordIDConfig(memberEmail));

  await axios(kickMemberConfig(discordID));
};

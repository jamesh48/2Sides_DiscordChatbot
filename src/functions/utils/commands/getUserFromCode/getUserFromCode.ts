import axios from "axios";
import { CodeFromDiscord } from "types/staticTypes";
import { getAccessCodeParams } from "../enableChannelAccess/authConfigs/accessCodeParams";
import { getUserParams } from "../enableChannelAccess/authConfigs/getUserParams";

export async function getUserFromCode(code: CodeFromDiscord) {
  // Get Access Code
  const { data: oAuthData } = await axios.post(
    "https://discord.com/api/oauth2/token",
    getAccessCodeParams(code, "?command=registrationPortal")
  );

  // Get User from Access Code
  const { data: candidateUser } = await axios(
    "https://discord.com/api/users/@me",
    getUserParams(oAuthData.token_type, oAuthData.access_token)
  );

  return candidateUser;
}

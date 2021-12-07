import axios from "axios";
import { DiscordResponseData } from "Types";
import { authConfig } from "./responseConfigs/authConfig";

export default async function sendResponse(
  response: DiscordResponseData,
  interactionToken: string
): Promise<boolean> {
  try {
    const validRequest = await axios(authConfig(interactionToken, response));
    return validRequest.status == 200;
  } catch (exception) {
    console.log(`There was an error posting a response: ${exception}`);
    return false;
  }
}

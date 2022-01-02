import axios from "axios";
import wSB from "wix-secrets-backend";

const handleAutomationErrorConfig = async (errArr, automationType) => {
  const AWS_API_KEY = await wSB.getSecret("AWS_API_KEY");
  const API_GATEWAY_URL = await wSB.getSecret("API_GATEWAY_URL");
  const [errMessage, errEmail, errDiscordID, errChannels] = errArr;
  return {
    method: "POST",
    url: API_GATEWAY_URL,
    data: JSON.stringify({
      data: {
        errMessage,
        errEmail,
        errDiscordID,
        errChannels,
        automationType,
        command: "automationFailAlert",
        apiKey: AWS_API_KEY
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };
};

export async function handleAutomationError(errArr, automationType) {
  const config = await handleAutomationErrorConfig(errArr, automationType);
  try {
    await axios(config);
    return "ok";
  } catch (err) {
    console.log(err);
  }
}

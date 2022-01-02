import axios from "axios";
import { UserEmail } from "staticTypes";

export const assignBadge = async (userEmail: UserEmail) => {
  // @ts-ignore
  const { wixAPIKey, wixWebsiteName } = JSON.parse(process.env.WIX_CREDENTIALS);

  await axios.post(`${wixWebsiteName}/_functions/assignBadge`, null, {
    params: { email: userEmail.trim() },
    headers: {
      Authorization: wixAPIKey
    }
  });
  return "ok";
};

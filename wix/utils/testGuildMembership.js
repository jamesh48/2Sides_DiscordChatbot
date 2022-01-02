import wixData from "wix-data";
import { suppressOptions } from "../utils/constants.js";

export const testGuildMembership = async (email) => {
  const { items } = await wixData
    .query("purchased_candidates")
    .eq("email", email)
    .hasSome("purchasedProductName", ["The Guild", "The Guild Patron"])
    .find(suppressOptions);

  // User Hasn't bought a guild membership
  if (!items.length) {
    throw new Error(
      "404 The email: " +
        email +
        " does not exist on any paid Guild Membership. \n If your Discord Email does not match your Guild Subscription Email, you can enter the email you purchased the Guild Subscription with below \n If there is a match then I'll send you an email to verify."
    );
  }

  // User has already registered, there is a discordID in the system
  if (items[0].discordID && items[0].discordID.split("_")[0] !== "xid") {
    throw new Error(
      "400 The user with the email: " +
        email +
        " is already registered. \n if you believe this is an error, please message info@dannygoldsmithmagic.com"
    );
  }

  return "ok";
};

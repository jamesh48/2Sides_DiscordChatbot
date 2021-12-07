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
    throw new Error("Users email does not exist on any paid Guild Membership");
  }

  console.log("!!!", typeof items[0].discordID);
  // User has already registered
  if (items[0].discordID && items[0].discordID.indexOf("xid_") === -1) {
    throw new Error("User is already registered");
  }

  return "ok";
};

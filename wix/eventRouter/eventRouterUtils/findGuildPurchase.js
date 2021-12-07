import wixData from "wix-data";
import { suppressOptions } from "../../utils/constants.js";

export const findGuildPurchase = async (userEmail) => {
  const guildPurchased = await wixData
    .query("purchased_candidates")
    .eq("email", userEmail)
    .hasSome("purchasedProductName", ["The Guild", "The Guild Patron"])
    .find(suppressOptions);

  const guildPurchasedAndRegistered = guildPurchased.items.filter(
    (x) => x.discordID && x.discordID.indexOf("xid_") === -1
  );

  if (guildPurchasedAndRegistered.length) {
    return guildPurchasedAndRegistered[0].discordID;
  }

  return false;
};

import wixData from "wix-data";
import { suppressOptions } from "../utils/constants.js";
import Promise from "bluebird";

/* This Controller Resets a Users DB info in case they want to purchase again, it also returns the discordID to kick the member from the guild */
export const usersDiscordId = async (req) => {
  const {
    items: [{ _id, discordID }]
  } = await wixData
    .query("purchased_candidates")
    .eq("email", req.query.email)
    .hasSome("purchasedProductName", ["The Guild", "The Guild Patron"])
    .find(suppressOptions);

  const { items: itemsToRemoveDiscordIDFrom } = await wixData
    .query("purchased_candidates")
    .eq("email", req.query.email)
    .find(suppressOptions);

  // Remove Discord IDs from the users purchased products.
  await Promise.each(itemsToRemoveDiscordIDFrom, async (item) => {
    const toUpdate = { ...item, discordID: null };
    return wixData.update("purchased_candidates", toUpdate, suppressOptions);
  });

  // If the user has purchased products with a different email, remove those discordId's as well.
  const { items: additionalItemsToRemoveDiscordIDFrom } = await wixData
    .query("purchased_candidates")
    .eq("discordID", discordID)
    .find(suppressOptions);

  await Promise.each(additionalItemsToRemoveDiscordIDFrom, async (item) => {
    const toUpdate = { ...item, discordID: null };
    return wixData.update("purchased_candidates", toUpdate, suppressOptions);
  });
  // Remove that the trace that the User purchased a Guild Subscription.
  await wixData.remove("purchased_candidates", _id, suppressOptions);

  // return discordID so user gets booted in Guild as well.
  return discordID;
};

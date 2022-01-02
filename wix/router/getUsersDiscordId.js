import wixData from "wix-data";
import { suppressOptions } from "../utils/constants.js";
import Promise from "bluebird";

/* This Controller Resets a Users DB info in case they want to purchase again, it also returns the discordID to kick the member from the guild */
export const usersDiscordId = async (req) => {
  if (!req.query.email) {
    throw new Error(
      [
        "The kick automation was triggered but there was no email provided for the kick so there is no data available, it is unlikely that this should happen but you may need to audit and/or contact James",
        "No email indicated",
        "No discordId",
        "no additional data"
      ].join("||")
    );
  }

  // Get DiscordID using the request email, if there is no discordID,
  var { items } = await wixData
    .query("purchased_candidates")
    .eq("email", req.query.email)
    .hasSome("purchasedProductName", ["The Guild", "The Guild Patron"])
    .find(suppressOptions);

  if (!items.length) {
    throw new Error(
      [
        "Based on the provided email the users purchased guild subscription was not found, and so a discordID was not found, they were not kicked from the guild and their actual discordId remains in the PurchasedCandidates database",
        req.query.email,
        "No DiscordId found",
        "No additional details"
      ].join("||")
    );
  }

  try {
    var [{ _id, discordID }] = items;

    const { items: itemsToRemoveDiscordIDFrom } = await wixData
      .query("purchased_candidates")
      .eq("email", req.query.email)
      .find(suppressOptions);

    // If the user has purchased products with a different email, remove those discordId's as well.
    const { items: additionalItemsToRemoveDiscordIDFrom } = await wixData
      .query("purchased_candidates")
      .eq("discordID", discordID)
      .find(suppressOptions);

    // Remove Discord IDs from the users purchased products.
    await Promise.each(itemsToRemoveDiscordIDFrom, async (item) => {
      const toUpdate = { ...item, discordID: null };
      return wixData.update("purchased_candidates", toUpdate, suppressOptions);
    });

    await Promise.each(additionalItemsToRemoveDiscordIDFrom, async (item) => {
      const toUpdate = { ...item, discordID: null };
      return wixData.update("purchased_candidates", toUpdate, suppressOptions);
    });
    // Remove that the trace that the User purchased a Guild Subscription.
    await wixData.remove("purchased_candidates", _id, suppressOptions);
    // return discordID so user gets booted in Guild as well.
    return discordID;
  } catch (err) {
    throw new Error(
      [
        err.message,
        req.query.email,
        discordID,
        "WIX failed to complete the full removal of the Guild Subscription and discordID from associated products"
      ].join("||")
    );
  }
};

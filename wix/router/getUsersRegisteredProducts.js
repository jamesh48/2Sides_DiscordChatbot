import wixData from "wix-data";
import Promise from "bluebird";
import { suppressOptions } from "../utils/constants.js";
import { testGuildMembership } from "../utils/testGuildMembership.js";

export const usersRegisteredProducts = async (req) => {
  // First Test that the user has purchased the guild subscription.
  await testGuildMembership(req.query.email);
  // Find items where the email matches and the discordID matches the random token
  const { items: purchasedProductArr } = await wixData
    .query("purchased_candidates")
    .eq("email", req.query.email)
    .eq("discordID", req.query.tempRandToken)
    .find(suppressOptions);

  if (!purchasedProductArr.length) {
    throw new Error("No New Products To Register");
  }

  /* ----------------->UPDATE DB<----------------- */
  let finalPurchasedProductArr = [];
  await Promise.each(purchasedProductArr, async (item) => {
    const toUpdate = { ...item, discordID: req.query.discordId };
    finalPurchasedProductArr.push(item.purchasedProductName);
    await wixData.update("purchased_candidates", toUpdate, suppressOptions);
  });

  return finalPurchasedProductArr;
};

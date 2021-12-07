import wixData from "wix-data";
import Promise from "bluebird";
import { suppressOptions } from "../utils/constants.js";
import { testGuildMembership } from "../utils/testGuildMembership.js";
import { genRandToken } from "../utils/randomToken.js";

export const postRandomToken = async (req) => {
  await testGuildMembership(req.query.email);

  // User has purchased a guild membership from here->
  const tempRandToken = genRandToken();
  const { items: purchasedProductArr } = await wixData
    .query("purchased_candidates")
    .eq("email", req.query.email)
    .find(suppressOptions);

  // Update old refresh tokens and newly purchased Products
  const newlyPurchasedProducts = purchasedProductArr.filter((x) => {
    // Newly Purchased Products
    if (!x.discordID) {
      return x;
    }
    // Refresh old token;
    const xidSplit = x.discordID.split("_");
    if (xidSplit[0] === "xid") {
      return x;
    }
  });

  let channelsToJoin = [];
  /* -----------------> UPDATE DB <-------------------------- */
  await Promise.each(newlyPurchasedProducts, (item) => {
    const toUpdate = { ...item, discordID: tempRandToken };

    // Update the tempRandToken in every category, but only send back registered purchased products for user validation.
    if (item.purchasedProductName.toLowerCase().indexOf("guild") === -1) {
      channelsToJoin.push(item.purchasedProductName);
    }
    return wixData.update("purchased_candidates", toUpdate, suppressOptions);
  });

  return [tempRandToken, channelsToJoin.join(", ")];
};

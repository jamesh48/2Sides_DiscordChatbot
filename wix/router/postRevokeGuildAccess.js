import wixData from "wix-data";
import Promise from "bluebird";
import { suppressOptions } from "../utils/constants.js";

// This Function is deprecated.
export const revokeGuildAccess = async (req) => {
  if (!req.query.email) {
    throw new Error("No Email Provided");
  }

  const { items: purchasedProductArr } = await wixData
    .query("purchased_candidates")
    .eq("email", req.query.email)
    .find(suppressOptions);

  if (!purchasedProductArr.length) {
    throw new Error("Email not found");
  }

  //----------------->UPDATE DB<----------------------------------
  await Promise.each(purchasedProductArr, (item) => {
    const toUpdate = { ...item, discordID: null };
    return wixData.update("purchased_candidates", toUpdate, suppressOptions);
  });
  return "ok";
};

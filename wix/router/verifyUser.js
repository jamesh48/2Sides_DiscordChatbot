import wixData from "wix-data";
import { suppressOptions } from "../utils/constants.js";
import Promise from "bluebird";

export const verifyUser = async (req) => {
  console.log("verifyUser");
  console.log(req.query.discordId);
  const { items: purchasedProductArr } = await wixData
    .query("purchased_candidates")
    // The email isn't really needed here.
    // .eq('email', req.query.email)
    .eq("discordID", req.query.tempRandToken)
    .find(suppressOptions);

  if (!purchasedProductArr.length) {
    throw new Error(
      "Verification failed: \n There are no new subscriptions and associated products to register \n If you believe this is an error please e-mail info@dannygoldsmithmagic.com"
    );
  }

  /*----------------->UPDATE DB<-----------------*/
  let finalPurchasedProductArr = [];
  await Promise.each(purchasedProductArr, async (item) => {
    const toUpdate = { ...item, discordID: req.query.discordId };
    finalPurchasedProductArr.push(item.purchasedProductName);
    await wixData.update("purchased_candidates", toUpdate, suppressOptions);
  });

  return finalPurchasedProductArr;
};

import wSB from "wix-secrets-backend";
import wixData from "wix-data";
import axios from "axios";
import { suppressOptions } from "../utils/constants.js";
import { genDataObj } from "./eventRouterUtils/genDataObj.js";
import { findGuildPurchase } from "./eventRouterUtils/findGuildPurchase.js";

const enableChannelAccess = async (discordID, channels) => {
  const API_GATEWAY_URL = await wSB.getSecret("API_GATEWAY_URL");
  await axios(`${API_GATEWAY_URL}?discordId=${discordID}&channels=${channels}`);
};

export const handleOrderPaid = async (event) => {
  const discordID = await findGuildPurchase(event.buyerInfo.email);
  // DiscordID is either a boolean, false or a string.
  if (discordID) {
    await enableChannelAccess(
      discordID,
      event.lineItems.map((x) => x.name.toLowerCase())
    );
  }
  /*----------> Collect User Information <----------*/
  /*-----> First Name, Last name and email are required by WIX <-----*/
  const userEmail = event.buyerInfo.email;
  const username = event.buyerInfo.firstName + " " + event.buyerInfo.lastName;
  /*-----> These Fields are not required by WIX. <-----*/
  const city = event.billingInfo.address?.city || "Not Provided";
  const country = event.billingInfo.address?.country || "Not Provided";

  /*----------> Build Promise Array for each Product Bought <----------*/
  const promiseArr = event.lineItems.map(({ name: purchasedProductName }) => {
    const dataToInsert = genDataObj(
      userEmail,
      purchasedProductName,
      null,
      null,
      username,
      city,
      country
    );
    /*-----> Return unresolved promise <-----*/
    return wixData.insert(
      "purchased_candidates",
      dataToInsert,
      suppressOptions
    );
  });

  try {
    /*-----> Wait for all data to be inserted <----*/
    await Promise.all(promiseArr);
  } catch (err) {
    throw new Error(err.message);
  }
};

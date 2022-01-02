import wSB from "wix-secrets-backend";
import wixData from "wix-data";
import axios from "axios";
import { suppressOptions } from "../utils/constants.js";
import { genDataObj } from "./eventRouterUtils/genDataObj.js";
import { findGuildPurchase } from "./eventRouterUtils/findGuildPurchase.js";

const enableChannelAccess = async (discordID, channels) => {
  const API_GATEWAY_URL = await wSB.getSecret("API_GATEWAY_URL");
  const AWS_API_KEY = await wSB.getSecret("AWS_API_KEY");
  const addNewChannelsConfig = {
    method: "POST",
    url: `${API_GATEWAY_URL}`,
    data: JSON.stringify({
      data: {
        discordId: discordID,
        channels: channels.join(" "),
        command: "enableNewChannels",
        apiKey: AWS_API_KEY
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  };

  await axios(addNewChannelsConfig);
};

export const handleOrderPaid = async (event) => {
  try {
    var discordID = await findGuildPurchase(event.buyerInfo.email);
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
        discordID || null,
        null,
        username,
        city,
        country
      );
      /*-----> Return unresolved promise <-----*/
      return wixData.insert("purchased_candidates", dataToInsert, suppressOptions);
    });
    /*-----> Wait for all data to be inserted <----*/
    await Promise.all(promiseArr);
  } catch (err) {
    throw new Error(
      [
        err.message,
        event.buyerInfo.email,
        discordID || "Unknown DiscordID",
        "Attempting to grant access to..." + event.lineItems.map((x) => x.name).join(" ")
      ].join("||")
    );
  }
};

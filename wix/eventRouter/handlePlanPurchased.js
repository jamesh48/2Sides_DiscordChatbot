import wixData from "wix-data";
import { suppressOptions } from "../utils/constants.js";
import { genDataObj } from "./eventRouterUtils/genDataObj.js";

export const handlePlanPurchased = async (event) => {
  /*----------> Collect Member Info <----------*/
  const planName = event.order.planName;
  const paymentStatus = event.order.paymentStatus;

  const { items: connectedMember } = await wixData
    .query("Members/PrivateMembersData")
    .eq("_id", event.order.memberId)
    .find();

  if (connectedMember.length === 1) {
    const memberEmail = connectedMember[0].loginEmail;
    const memberName = connectedMember[0].name;
    const dataToInsert = genDataObj(
      memberEmail,
      planName,
      null,
      paymentStatus,
      memberName,
      "N/A",
      "N/A"
    );
    await wixData.insert("purchased_candidates", dataToInsert, suppressOptions);
  }
};

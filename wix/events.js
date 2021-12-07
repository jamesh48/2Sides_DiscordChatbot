/*****************
 backend/events.js
 *****************

 'backend/events.js' is a reserved Velo file that enables you to handle backend events.

 Many of the Velo backend modules, like 'wix-stores-backend' or 'wix-media-backend', include events that are triggered when
 specific actions occur on your site. You can write code that runs when these actions occur.

 For example, you can write code that sends a custom email to a customer when they pay for a store order.

 ---
 More about Velo Backend Events:
 https://support.wix.com/en/article/velo-backend-events

*******************/
import { handleOrderPaid } from "./eventRouter/handleOrderPaid.js";
import { handlePlanPurchased } from "./eventRouter/handlePlanPurchased.js";

export async function wixStores_onOrderPaid(event) {
  try {
    await handleOrderPaid(event);
  } catch (err) {
    console.log(err.message);
  }
}

export async function wixPaidPlans_onPlanPurchased(event) {
  try {
    await handlePlanPurchased(event);
  } catch (err) {
    console.log(err.message);
  }
}

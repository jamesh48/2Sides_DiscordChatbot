import wixData from "wix-data";
import { badges } from "wix-members-backend";
import { suppressOptions } from "../../utils/constants.js";

// Add Badge on Purchase
export const addBadge = async (email) => {
  // Get all Potential Badges
  const memberBadges = await wixData.query("Members/Badges").find(suppressOptions);

  // Reduce those badges into a simple shape
  const reducedBadges = memberBadges.items.reduce((total, item) => {
    total.push({ _id: item._id, title: item.title });
    return total;
  }, []);

  // Get a Member based on the passed in email, in this case they are already registered
  const { items: connectedMember } = await wixData
    .query("Members/PrivateMembersData")
    .eq("loginEmail", email)
    .find(suppressOptions);

  const { items: purchasedProductArr } = await wixData
    .query("purchased_candidates")
    .eq("email", email)
    .find(suppressOptions);

  const mappedPurchasedProducts = purchasedProductArr.map((x) => x.purchasedProductName);

  // Select the appropriate badges to assign based on purchase.
  const selectedBadges = reducedBadges.reduce((total, badge) => {
    if (mappedPurchasedProducts.indexOf(badge.title) > -1) {
      total.push(badge);
    }
    return total;
  }, []);

  console.log("selected badges-> ", selectedBadges);
  // Get members purchased products.
  const memberID = connectedMember[0]["_id"];

  // Assign each badge to the member.
  await selectedBadges.forEach(async (badge) => {
    await badges.assignMembers(badge._id, [memberID]);
  });
};

// export const updateLoop = async () => {
//     const memberBadges = await wixData.query("Members/Badges")
//         .find(suppressOptions);

//     // Reduce those badges into a simple shape
//     const reducedBadges = memberBadges.items.reduce((total, item) => {
//         total.push({ _id: item._id, title: item.title.toLowerCase() });
//         return total;
//     }, []);

//     const { items: connectedMembers } = await wixData.query("Members/PrivateMembersData")
//         .limit(100)
//         .find(suppressOptions);

//     console.log(connectedMembers.length);
//     await connectedMembers.forEach(async (member, index) => {
//         const { items: purchasedProductArr } = await wixData.query('purchased_candidates')
//             .eq('email', member.loginEmail)
//             .find(suppressOptions);

//         const mappedPurchasedProducts = purchasedProductArr.map((x) => x.purchasedProductName)

//         // Select the appropriate badges to assign based on purchase.
//         const selectedBadges = reducedBadges.reduce((total, badge) => {
//             if (mappedPurchasedProducts.indexOf(badge.title.toLowerCase()) > -1) {
//                 total.push(badge);
//             }
//             return total;
//         }, []);

//         // Get members purchased products.
//         const memberID = member['_id'];

//         // Assign each badge to the member.
//         await selectedBadges.forEach(async (badge) => {
//             await badges.assignMembers(badge._id, [memberID]);
//         })
//     })

// }

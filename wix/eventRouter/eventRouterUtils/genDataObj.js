export const genDataObj = (
  email,
  purchasedProductName,
  discordID,
  guildPaymentStatus,
  name,
  city,
  country
) => {
  return {
    email: email,
    purchasedProductName: purchasedProductName,
    discordID: discordID,
    guildPaymentStatus: guildPaymentStatus,
    name: name,
    city: city,
    country: country
  };
};

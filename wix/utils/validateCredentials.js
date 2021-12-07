import wSB from "wix-secrets-backend";

export const validateCredentials = async (req) => {
  // No Secret is Provided
  if (!req.headers.authorization) {
    throw new Error("CREDENTIALS NOT PROVIDED");
  }

  const API_KEY = await wSB.getSecret("API_KEY");

  // Invalid Secret
  if (req.headers.authorization !== `Bearer ${API_KEY}`) {
    throw new Error("INVALID CREDENTIALS");
  }
};

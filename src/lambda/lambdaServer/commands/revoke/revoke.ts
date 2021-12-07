import {
  revokeAccessToAllPrivateChannels,
  revokeGuildAccessInWix
} from "./revokeUtils/revokeUtilsIndex";

export async function revoke(discordId: string, userEmail: string) {
  try {
    // Then remove discord id on WIX side (requires email);
    // This should throw an error if email doesn't match
    await revokeGuildAccessInWix(userEmail, discordId);
    // Revoke access to private channels (testing only)
    await revokeAccessToAllPrivateChannels(discordId);
  } catch (err) {
    // @ts-ignore
    console.log(err.message);
  }
}

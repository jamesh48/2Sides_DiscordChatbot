import { DiscordSecrets } from "Types";

/**
 * Cached Discord secrets so we can reduce warm start times.
 */
let __discordSecrets: DiscordSecrets | undefined = undefined;

/**
 * Gets the Discord secrets (public key, client ID, etc.) for use in our lambdas.
 *
 * @return {DiscordSecrets | undefined} The Discord secrets to be used.
 */
export async function getDiscordSecrets(): Promise<DiscordSecrets | undefined> {
  if (!__discordSecrets) {
    try {
      // @ts-ignore
      __discordSecrets = JSON.parse(process.env.DISCORD_CREDENTIALS);
    } catch (exception) {
      console.log(`Unable to get Discord secrets: ${exception}`);
    }
  }
  return __discordSecrets;
}

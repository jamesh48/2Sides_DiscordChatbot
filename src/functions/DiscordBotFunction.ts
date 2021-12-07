import { Lambda } from "aws-sdk";
import { Context, Callback } from "aws-lambda";
import { sign } from "tweetnacl";

import { DiscordEventRequest, DiscordEventResponse } from "Types";
import { getDiscordSecrets } from "DiscordSecrets";
import { commandLambdaARN } from "./constants/EnvironmentProps";

const lambda = new Lambda();

/**
 * Handles incoming events from the Discord bot.
 * @param {DiscordEventRequest} event The incoming request to handle.
 * @param {Context} _context The context this request was called with.
 * @param {Callback} callback A callback to handle the request.
 * @return {DiscordEventResponse} Returns a response to send back to Discord.
 */
export async function handler(
  event: DiscordEventRequest,
  _context: Context,
  callback: Callback
): Promise<DiscordEventResponse> {
  console.log(`Received event: ${JSON.stringify(event)}`);

  // Only bypass verification when being invoked from an email address.
  if (event.email) {
    const lambdaPromise = lambda
      .invoke({
        FunctionName: commandLambdaARN,
        Payload: JSON.stringify(event),
        InvocationType: "Event"
      })
      .promise();
    // Fulfill promise before redirecting
    await lambdaPromise;

    callback(null, {
      location:
        "https://discord.com/channels/881917878641770577/881917879283515457"
    });
    // Type 8 is arbitary in this case
    return {
      type: 8
    };
  }

  if (event.jsonBody.data?.kick === "kick") {
    const lambdaPromise = lambda
      .invoke({
        FunctionName: commandLambdaARN,
        Payload: JSON.stringify(event),
        InvocationType: "Event"
      })
      .promise();

    await lambdaPromise;

    return {
      type: 9
    };
  }

  /* -----> Routes from Discord Slash Command <----- */
  /* -----> These require verification <----- */
  const verifyPromise = verifyEvent(event);

  if (event) {
    switch (event.jsonBody.type) {
      case 1:
        // Return pongs for pings
        if (await verifyPromise) {
          return {
            type: 1
          };
        }
        break;
      case 2:
        // Actual input request
        const lambdaPromise = lambda
          .invoke({
            FunctionName: commandLambdaARN,
            Payload: JSON.stringify(event),
            InvocationType: "Event"
          })
          .promise();
        if (await Promise.all([verifyPromise, lambdaPromise])) {
          console.log("Returning temporary response...");
          return {
            type: 5
          };
        }
        break;
    }
  }

  throw new Error("[UNAUTHORIZED] invalid request signature");
}

/**
 * Verifies that an event coming from Discord is legitimate.
 * @param {DiscordEventRequest} event The event to verify from Discord.
 * @return {boolean} Returns true if the event was verified, false otherwise.
 */
export async function verifyEvent(
  event: DiscordEventRequest
): Promise<boolean> {
  try {
    console.log("Getting Discord secrets...");
    const discordSecrets = await getDiscordSecrets();
    console.log("Verifying incoming event...");
    const isVerified = sign.detached.verify(
      Buffer.from(event.timestamp + JSON.stringify(event.jsonBody)),
      Buffer.from(event.signature, "hex"),
      Buffer.from(discordSecrets?.discordPublicKey ?? "", "hex")
    );
    console.log("Returning verification results...");
    return isVerified;
  } catch (exception) {
    console.log(exception);
    return false;
  }
}

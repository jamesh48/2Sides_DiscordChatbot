/*************************
 backend/http-functions.js

 Production endpoints:
  • Premium site:
    https://dannygoldsmithmagic.com/_functions/hello

 Test endpoints:
  • Premium sites:
    https://dannygoldsmithmagic.com/_functions-dev/hello

 ---
 About HTTP functions:
 https://support.wix.com/en/article/velo-exposing-a-site-api-with-http-functions

 API Reference:
 https://www.wix.com/velo/reference/wix-http-functions

**********************/
import { resObj } from "./utils/constants.js";
import { ok, badRequest, notFound, serverError } from "wix-http-functions";
import { validateCredentials } from "./utils/validateCredentials.js";
import { usersRegisteredProducts } from "./router/getUsersRegisteredProducts.js";
import { verifyUser } from "./router/verifyUser";
import { revokeGuildAccess } from "./router/postRevokeGuildAccess.js";
import { postRandomToken } from "./router/postRandomToken.js";
import { postAdditionalEmail } from "./router/postAdditionalEmail.js";
import { usersDiscordId } from "./router/getUsersDiscordId.js";
import { addBadge } from "./eventRouter/eventRouterUtils/addBadge.js";
import { handleAutomationError } from "./eventRouter/eventRouterUtils/handleAutomationError";
// import { updateLoop } from './eventRouter/eventRouterUtils/addBadge.js';

export async function get_usersRegisteredProducts(req) {
  try {
    await validateCredentials(req);
    const finalProductArr = await usersRegisteredProducts(req);
    resObj.body.message = finalProductArr;
    return ok(resObj);
  } catch (err) {
    resObj.body.error = err.message.slice(3);
    if (err.message.indexOf("400") > -1) {
      return badRequest(resObj);
    } else if (err.message.indexOf("404") > -1) {
      return notFound(resObj);
    } else if (err.message.indexOf("500") > -1) {
      return serverError(resObj);
    }

    return badRequest(resObj);
  }
}

export async function get_usersDiscordId(req) {
  try {
    // await validateCredentials(req);
    const discordId = await usersDiscordId(req);
    resObj.body.message = discordId;
    return ok(resObj);
  } catch (err) {
    console.log(err);
    await handleAutomationError(err.message.split("||"), "Kick Member");
    return notFound(resObj);
  }
}

export async function post_revokeGuildAccess(req) {
  try {
    await validateCredentials(req);
    await revokeGuildAccess(req);
    resObj.body.message = "ok";
    return ok(resObj);
  } catch (err) {
    resObj.body.error = err.message;
    return badRequest(resObj);
  }
}

export async function post_randomToken(req) {
  console.log("start-> post random token");
  try {
    await validateCredentials(req);
    const [tempRandToken, channelsToJoin] = await postRandomToken(req);
    resObj.body.tempRandToken = tempRandToken;
    resObj.body.channelsToJoin = channelsToJoin;
    return ok(resObj);
  } catch (err) {
    if (err.message.indexOf("404") !== -1) {
      resObj.body.error =
        "The email " + req.query.email + " does not exist on any paid Guild Membership";
      return notFound(resObj);
    } else if (err.message.indexOf("400") !== -1) {
      resObj.body.error =
        "The user with the email " + req.query.email + " is already registered.";
      return badRequest(resObj);
    } else if (err.message.indexOf("500") !== -1) {
      resObj.body.error = "Unknown Error";
      return serverError(resObj);
    }
    return badRequest(resObj);
  }
}

export async function post_assignBadge(req) {
  await addBadge(req.query.email);
  return ok(req);
}

export async function post_verifyUser(req) {
  try {
    await validateCredentials(req);
    const finalProductArr = await verifyUser(req);
    resObj.body.message = finalProductArr;
    return ok(resObj);
  } catch (err) {
    resObj.body.error = err.message;
    return notFound(resObj);
  }
}

export async function post_additionalEmail(req) {
  try {
    await validateCredentials(req);
    const [tempRandToken, channelsToJoin] = await postAdditionalEmail(req);
    resObj.body.tempRandToken = tempRandToken;
    resObj.body.channelsToJoin = channelsToJoin;
    return ok(resObj);
  } catch (err) {
    resObj.body.error = err.message;
    if (err.message.indexOf("404") !== -1) {
      return notFound(resObj);
    } else if (err.message.indexOf("400") !== -1) {
      return badRequest(resObj);
    } else if (err.message.indexOf("500") !== -1) {
      return serverError(resObj);
    }
    return badRequest(resObj);
  }
}

// export async function get_updateLoop(req) {
//     await updateLoop();
//     return ok(req);
// }

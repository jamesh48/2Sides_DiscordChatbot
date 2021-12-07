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
import { ok, badRequest } from "wix-http-functions";
import { validateCredentials } from "./utils/validateCredentials.js";
import { usersRegisteredProducts } from "./router/getUsersRegisteredProducts.js";
import { revokeGuildAccess } from "./router/postRevokeGuildAccess.js";
import { postRandomToken } from "./router/postRandomToken.js";
import { usersDiscordId } from "./router/getUsersDiscordId.js";

export async function get_usersRegisteredProducts(req) {
  try {
    await validateCredentials(req);
    const finalProductArr = await usersRegisteredProducts(req);
    resObj.body.message = finalProductArr;
    return ok(resObj);
  } catch (err) {
    resObj.body.error = err.message;
    return badRequest(resObj);
  }
}

export async function get_usersDiscordId(req) {
  try {
    const discordId = await usersDiscordId(req);
    console.log(discordId);
    resObj.body.message = discordId;
    console.log(resObj);
    return ok(resObj);
  } catch (err) {
    console.log(err);
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
    console.log(resObj);
    return ok(resObj);
  } catch (err) {
    console.log(err.message);
    resObj.body.error = err.message;
    return badRequest(resObj);
  }
}

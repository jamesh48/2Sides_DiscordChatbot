/* eslint-disable indent */
import { DiscordChannelsStr, DiscordId, TempRandToken, UserEmail } from "staticTypes";

export const redeemEmailTemplate = (
  userEmail: UserEmail,
  channelsToJoin: DiscordChannelsStr,
  tempRandToken: TempRandToken,
  discordId: DiscordId,
  username: UserEmail
) => {
  // @ts-ignore
  const { wixWebsiteName } = JSON.parse(process.env.WIX_CREDENTIALS);
  const validationLink = `https://ws4mcufss9.execute-api.us-east-1.amazonaws.com/prod/event?command=verification&tempRandToken=${tempRandToken}&discordId=${discordId}&email=${userEmail}`;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <style type="text/css">
      @font-face {
        font-family: 'Raleway';
        font-style: normal;
        font-weight: 200;
        src: local('Raleway'), url(https://fonts.gstatic.com/s/raleway/v9/UAnF6lSK1JNc1tqTiG8pNALUuEpTyoUstqEm5AMlJo4.ttf) format('truetype');
      }
      body {
        font-family: Raleway;
        background: linear-gradient(
          80deg,
          rgba(2, 0, 36, 1) 0%,
          rgba(9, 9, 121, 1) 25%,
          rgba(0, 212, 255, 1) 100%
        );
        position: relative;
        height: 100vmin;
      }
      .email-line-item {
        display: block;
        height: 5.5vh;
        margin: 1.5% auto;
      }

      .underline {
        text-decoration: underline;
      }
      #table-root {
        background-color: lightblue;
        border: 1px solid black;
        text-align: center;
        padding: 0 2.5%;
        font-size: 1.5vmax;
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        height: 60vh;
      }
      #purchased-product-display {
        border-bottom: 1px solid black;
        width: 50%;
      }

      #validate-button {
        background: linear-gradient(
          240deg,
          rgba(2, 0, 36, 1) 0%,
          rgba(9, 9, 121, 1) 25%,
          rgba(0, 212, 255, 1) 100%
        );
        color: ivory;
        padding: 1.25% 2.5%;
        font-size: 0.75vmax;
        letter-spacing: 0.05em;
      }

      #validate-button:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <table id="table-root">
      <tr>
        <td class="email-line-item">
          A request was made by user <b>${username}</b> to enable a Discord
          Guild Access purchase from:
        </td>
        <td class="email-line-item">
          <b>${wixWebsiteName}</b>
        </td>
        <td class="email-line-item underline">
          <b
            >If you did not make this request- please ignore this email and/or
            contact info@dannygoldsmithmagic.com</b
          >
        </td>
        ${
          channelsToJoin
            ? `<td class="email-line-item">
        Otherwise, please click the button below to validate your Guild Access
        Purchase, as well as access to these exclusive channels:
      </td>
      <td id="purchased-product-display" class="email-line-item">
        <b>${channelsToJoin}</b>
      </td>`
            : `<td class="email-line-item">
          Otherwise, please click the button below to validate your Guild Access Purchase
          </td>
          `
        }

        <td class="email-line-item">
          <a href=${validationLink}>
            <input type="button" value="Validate" id="validate-button" />
          </a>
        </td>
        <td class="email-line-item">Welcome To The Guild,</td>
        <td class='email-line-item'>-Magic Wand</td>
      </tr>
    </table>
  </body>
</html>`;
};

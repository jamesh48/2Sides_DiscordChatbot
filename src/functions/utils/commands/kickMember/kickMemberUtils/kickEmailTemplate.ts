import { UserEmail } from "types/staticTypes";

export const kickEmailTemplate = (userEmail: UserEmail) => {
  // @ts-ignore
  const { wixWebsiteName } = JSON.parse(process.env.WIX_CREDENTIALS);

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
        position: relative;
        height: 100vmin;
      }
      .email-line-item {
        display: block;
        height: 5.5vh;
        margin: 1.5% auto;
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
        height: 50vh;
      }
    </style>
  </head>
  <body>
    <table id="table-root">
      <tr>
        <td class="email-line-item">
          This email is to notify that the Discord user associated with the email:
        </td>
         <td class="email-line-item">
          ${userEmail}
        </td>
        <td class="email-line-item">
          Guilds membership has been cancelled.
        </td>
        <td class="email-line-item">
          If you wish to rejoin the guild you can always do so by purchasing a subscription at:
        </td>
        <td class="email-line-item">
          ${wixWebsiteName}
        </td>
        <td class="email-line-item">
          We wish you the best.
        </td>
        <td class='email-line-item'>-Danny and Magic Wand</td>
      </tr>
    </table>
  </body>
</html>`;
};

import { DiscordChannelsStr, DiscordId, UserEmail } from "staticTypes";

export const automationFailAlertTemplate = (
  errMessage: string,
  errEmail: UserEmail,
  errDiscordID: DiscordId,
  errChannels: DiscordChannelsStr,
  automationType: string
) => {
  return /* html */ `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
      * {
        color: ivory;
        margin: 0;
        padding: 0;
      }

      #automation-fail-container {
        background-color: darkslategray;
        text-align: center;
        margin: 0 auto;
      }

      h4, p {
        margin-bottom: 1%;
      }

      h4 {
        text-decoration: underline;
      }

      #automation-msg-container {
        padding: 2%;
      }

      </style>
    </head>
    <body>
      <div id='automation-fail-container'>
        <div id='automation-msg-container'>
          <h4>There was an error that happened while attempting an automation, here are the details I have on the error:</h4>
          <p>Automation Type: ${automationType}</p>
          <p>Users Email: ${errEmail}</p>
          <p>Users DiscordID: ${errDiscordID}</p>
          <p>Error Message: ${errMessage}</p>
          <p>Additional Details: ${errChannels}</p>
        </div>
      </div>
    </body>
  </html>
  `;
};

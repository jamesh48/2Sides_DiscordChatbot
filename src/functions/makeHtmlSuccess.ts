export const makeHtmlSuccess = (channelsGranted: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Registration Success</title>
      <style>
        html {
          background: rgb(253,187,45);
          background: -moz-radial-gradient(circle, rgba(253,187,45,1) 40%, rgba(32,190,92,1) 100%);
          background: -webkit-radial-gradient(circle, rgba(253,187,45,1) 40%, rgba(32,190,92,1) 100%);
          background: radial-gradient(circle, rgba(253,187,45,1) 40%, rgba(32,190,92,1) 100%);
          filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#fdbb2d",endColorstr="#20be5c",GradientType=1);
        }

        html, body {
          height: 100%;
        }

        html {
          text-rendering: geometricPrecision;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        body {
          width: 90%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        #success-container {
          background-color: lightgreen;
          border: 1px solid black;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .access-announcement {
          text-decoration: underline;
          font-size: 1.75vmax;
        }

        .access-granted {
          font-size: 1.5vmax;
        }

        .access-granted {
          margin: 1.5% 0;
        }

        #channels-granted {
          margin: 1% 0;
          font-size: 1.5vmax;
        }

        .exclusive-access-container, #self-destruct-message {
          font-size: 1.25vmax;
        }

        .exclusive-access-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 1.5vmax;
        }

      </style>
    </head>

    <body>
      <div id='success-container'>
        <h4 class='access-announcement'>Welcome to the Guild!</h4>
        <h5 class='access-granted'>Your access has been granted.</h5>
        ${
  channelsGranted.length
  // eslint-disable-next-line max-len
  && `<div class='exclusive-access-container'><h5>You have also been granted access to the exclusive channels associated with these purchases:</h5><h4 id='channels-granted'>${channelsGranted}</h4><h5>If you buy additional products you will automatically be added to their exclusive channels as well!</h5></div>` || ""
}
        <h6 id='self-destruct-message'>Closing in... 59 seconds</h6>
      </div>

    </body>
    <script>
    function startTimer(duration, display) {
      var timer = duration, seconds;
      setInterval(function () {
          seconds = parseInt(timer % 60, 10);

          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = "This message will close itself in... " + 00 + ":" + seconds;

          if (--timer < 0) {
              window.close();
          }
      }, 1000);
  }

  window.onload = function () {
    var sixtySeconds = 59;
    var display = document.querySelector('#self-destruct-message');
    startTimer(sixtySeconds, display);
};
    </script>
  </html>
`;

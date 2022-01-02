import { DiscordId, UserEmail, Username } from "types/staticTypes";

export const makeHtmlNeutral = (
  errMessage: string,
  discordId: DiscordId,
  username: Username,
  attemptedEmail: UserEmail
) => {
  return (
    /* html */
    `<!DOCTYPE html>
      <html>
        <head>
          <title>Registration Portal</title>
            <script>window.history.replaceState(null, '', '/');</script>
            <link rel="icon" type="image/png" href="https://discord-chatbot-icos.s3.amazonaws.com/questionMark.ico">
            <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
            <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
            <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
          <style type="text/css">
              @font-face {
                font-family: 'Raleway';
                font-style: normal;
                font-weight: 200;
                src: local('Raleway'), url(https://fonts.gstatic.com/s/raleway/v9/UAnF6lSK1JNc1tqTiG8pNALUuEpTyoUstqEm5AMlJo4.ttf) format('truetype');
              }

              html {
                background: rgb(0,212,255);
                background: -moz-radial-gradient(circle, rgba(0,212,255,1) 30%, rgba(2,0,36,1) 47%, rgba(0,0,232,1) 89%);
                background: -webkit-radial-gradient(circle, rgba(0,212,255,1) 30%, rgba(2,0,36,1) 47%, rgba(0,0,232,1) 89%);
                background: radial-gradient(circle, rgba(0,212,255,1) 30%, rgba(2,0,36,1) 47%, rgba(0,0,232,1) 89%);
                filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#00d4ff",endColorstr="#0000e8",GradientType=1);
                font-family: Raleway;
              }

              html, body {
                height: 100%;
              }
              body {
                display: flex;
                justify-content: center;
                align-items: center;
              }

              h3 {
                margin: .5% 0;
              }

              #root {
                width: 70%;
              }

              #error-container{
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                padding: 2% 0;
                text-rendering: geometricPrecision;
                background-color: floralwhite;
                border: .5px solid black;
                box-shadow: white 0.25rem 0.25rem 0.5rem;
              }

              h3 {
                text-decoration: underline;
                margin-bottom: .5%;
                font-size: 1.5vmax;
              }

              #error-message-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 95%;
                text-align: center;
                padding: 0 2%;
              }

              .error-detail {
                font-size: 1.25vmax;
              }

              #error-redeemer-form {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
              }

              #validation-container {
                padding: 1.5% 0;
              }

              #redeemer-form-inputs {
                display: flex;
                width: 30%;
              }

              .redeemer-input {
                color: ivory;
              }

              #redeemer-input-text {
                flex: 1;
                background-color: darkcyan;
                text-align: center;
              }


              #redeemer-input-text:focus {
                background-color: green;
              }

              #redeemer-input-text:disabled {
                background-color: gray;
              }

              #redeemer-input-submit {
                background-color: darkslategray;
              }

              #redeemer-input-submit:hover {
                cursor: pointer;
                background-color: green;
              }

              #redeemer-input-submit:disabled {
                background-color: gray;
              }

              #success-container {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
          </style>
        </head>

        <body>
          <div id='root'></div>
          <script type='text/babel'>
            const errMessage = ${errMessage};
            const discordId = ${discordId};
            const username = ${username};
            const attemptedEmail = ${attemptedEmail};

            const InputForm = (props) => {
              const [emailVal, setEmailVal] = React.useState("");
              const [validationContainerMsg, setValidationContainerMsg] = React.useState([null, ""]);
              const [submitting, setSubmitting] = React.useState(false);
              const [countDownTimer, setCountDownTimer] = React.useState(30);

              const handleChange = () => {
                setEmailVal(event.target.value);
              };

              React.useEffect(() => {
                if (validationContainerMsg[0] === 'error' || validationContainerMsg[0] === null) {
                  setSubmitting(false);
                }
              }, [validationContainerMsg]);

              React.useEffect(() => {
                if (submitting === true) {
                  setEmailVal("");
                }
              }, [submitting])


              React.useEffect(() => {
                if (countDownTimer === 0) {
                  window.close();
                }
              }, [countDownTimer]);

              const startSelfDestructSequence = () => {
                setInterval(() => {
                    console.log('interval set...', countDownTimer);
                    setCountDownTimer(ex => ex - 1);
                  }, 1000);
              };

              React.useEffect(() => {
                if (validationContainerMsg[0] === "success") {
                  startSelfDestructSequence()
                }
              }, [validationContainerMsg]);

              const handleSubmit = () => {
                event.preventDefault();
                const memoedEmailVal = emailVal;
                  setSubmitting(true);

                  axios({
                    method: 'POST',
                    url: 'https://ws4mcufss9.execute-api.us-east-1.amazonaws.com/prod/event',
                    data: {
                      data: {
                        discordId: props.discordId,
                        email: memoedEmailVal,
                        username: props.username,
                        attemptedEmail: props.attemptedEmail,
                        command: 'redeem'
                      }
                    }
                  }).then((response) => {
                      // 404 and 400 respectively.
                      if (
                        response.data.indexOf("does not exist") > -1
                        || response.data.indexOf("already registered") > -1
                        || response.data.indexOf('Unknown Error') > -1
                        ) {
                        setValidationContainerMsg(["error", response.data]);
                      } else {
                        setValidationContainerMsg(["success", response.data])
                      }
                    });
              };

              return (
                <form onSubmit={handleSubmit} id='error-redeemer-form'>
                  {validationContainerMsg[0] === 'error' && <div id='validation-container'>{validationContainerMsg[1]}</div>}
                  {validationContainerMsg[0] === 'success' ?
                  <div id='success-container'>
                    <div id='validation-container'>{validationContainerMsg[1]}</div>
                    <p>Window will close in {countDownTimer} seconds</p>
                  </div> :
                    (<div id='redeemer-form-inputs'>
                      <input className='redeemer-input' id='redeemer-input-text' type='text' value={emailVal} onChange={handleChange} disabled={!!submitting}></input>
                      <input className='redeemer-input' id='redeemer-input-submit' type='submit' disabled={!!submitting}></input>
                    </div>)
                  }
                </form>
              )
            }

            const App = (props) => {
              return (
                <div id='error-container'>
                  <h3>There was an issue with your Guild Registration:</h3>
                  <div id='error-message-container'>
                  {props.errMessage
                      .split("\\n")
                      .map((x, i) => <p key={i} className='error-detail'>{x}</p>)
                  }
                  </div>
                  <InputForm discordId={props.discordId} username={props.username} attemptedEmail={props.attemptedEmail}/>
              </div>
                )
            }

            ReactDOM.render(
              <App
              errMessage={errMessage}
              discordId={discordId}
              username={username}
              attemptedEmail={attemptedEmail}
              />,
              document.getElementById("root"));

            </script>
        </body>
      </html>`
  );
};

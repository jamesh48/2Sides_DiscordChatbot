import { DiscordId, Username } from "types/staticTypes";

export const makeRegistrationPortal = (discordId: DiscordId, username: Username) => {
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
                text-rendering: geometricPrecision;
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

              #registration-portal-container,
              #validation-msg-container,
              #input-form-container,
              #input-form {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
              }

              #registration-portal-container{
                width: 100%;
                padding: 2% 0;
                background-color: floralwhite;
                border: .5px solid black;
                box-shadow: darkcyan 0.25rem 0.25rem 0.5rem;
              }

              h3 {
                text-decoration: underline;
                margin-bottom: .5%;
                font-size: 1.5vmax;
                text-decoration-thickness: from-font;
                text-underline-offset: .5rem;
              }

              #inputs-container {
                display: flex;
                width: 50%;
                justify-content: center;
              }

              .input-form-input {
                color: ivory;
              }

              #input-form-text {
                background-color: darkcyan;
                text-align: center;
                flex: .6;
              }


              #input-form-text:focus {
                background-color: green;
              }

              #input-form-text:disabled {
                background-color: gray;
              }

              #input-form-submit {
                flex: .1;
                background-color: darkslategray;
              }

              #input-form-submit:hover {
                cursor: pointer;
                background-color: green;
              }

              #input-form-submit:disabled {
                background-color: gray;
              }

              .valiation-msg-container,
              .validation-msg {
                margin: 0;
                margin-bottom: 1.25%;
              }
          </style>
        </head>

        <body>
          <div id='root'></div>
          <script type='text/babel'>
            const discordId = ${discordId};
            const username = ${username};

            const InputForm = (props) => {

              const [emailVal, setEmailVal] = React.useState('');
              const [submitting, setSubmitting] = React.useState(false);
              const [validationMsgArr, setValidationMsgArr] = React.useState([]);

              const handleChange = () => {
                setEmailVal(event.target.value);
              };

              React.useEffect(() => {
                if (submitting === true) {
                  setEmailVal("");
                }
              }, [submitting])

              const handleSubmit = () => {
                event.preventDefault();
                const savedEmailVal = emailVal;
                  setSubmitting(true);

                  axios({
                    method: 'POST',
                    url: 'https://ws4mcufss9.execute-api.us-east-1.amazonaws.com/prod/event',
                    data: {
                      data: {
                        discordId: props.discordId,
                        email: savedEmailVal,
                        username: props.username,
                        command: 'registerAdditionalEmail'
                      }
                    }
                  }).then((response) => {
                    console.log(response.data);
                    if (response.data.indexOf('200') > -1) {
                      setValidationMsgArr((ex) => {
                      if (ex.indexOf(response.data.replace('200', '')) === -1) {
                          ex.push(response.data.replace('200', ''));
                        }
                          return ex;
                        });
                      } else if (response.data.indexOf('400') > -1 || response.data.indexOf('404') > -1) {
                        setValidationMsgArr(ex => {
                          if (ex.indexOf(response.data.replace('400', '').replace('404', '')) === -1) {
                            ex.push(response.data.replace('400', '').replace('404', ''));
                          }
                          return ex;
                        });
                      } else {
                        setValidationMsgArr(ex => {
                          const newUnknownMsg = 'There was an unknown error';
                          if (ex.indexOf(newUnknownMsg) === -1) {
                            ex.push('There was an unknown error')
                          }
                          return ex;
                        });
                      }
                  }).finally(() => {
                    setSubmitting(false);
                  });
              };

              return (
                <div id='input-form-container'>
                  {validationMsgArr.length &&
                    <div className='validation-msg-container'>
                      {validationMsgArr.map((x, i) => {
                        return <p key={i} className='validation-msg'>{x}</p>
                      })}
                    </div> || null
                  }
                  <form id='input-form' onSubmit={handleSubmit}>
                    <div id='inputs-container'>
                      <input className='input-form-input' id='input-form-text' type='text' onChange={handleChange} value={emailVal} disabled={!!submitting}></input>
                      <input className='input-form-input' id='input-form-submit' type='submit' disabled={!!submitting}></input>
                    </div>
                  </form>
                </div>
              )
            }

            const RegistrationPortalApp = (props) => {
              console.log(discordId, username);
              return (
                <div id='registration-portal-container'>
                  <h3>Registration Portal</h3>
                  <h4>For exclusive access to channels please enter the email used to purchase those products below</h4>
                  <InputForm discordId={props.discordId} username={props.username}/>
              </div>
                )
            }

            ReactDOM.render(
              <RegistrationPortalApp
              discordId={discordId}
              username={username}
              />,
              document.getElementById("root"));

            </script>
        </body>
      </html>`
  );
};

import { DiscordChannelsStr, DiscordId, UserEmail, Username } from "types/staticTypes";

/* eslint-disable operator-linebreak */
export const makeHtmlSuccess = (
  channelsGranted: DiscordChannelsStr,
  discordId: DiscordId,
  registeredUsersEmail: UserEmail,
  registeredUsername: Username,
  addEmailIndicator: boolean
) => {
  return (
    /* html */
    `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Registration Success</title>
        <script>window.history.replaceState(null, '', '/');</script>
        <link rel="icon" type="image/png" href="https://discord-chatbot-icos.s3.amazonaws.com/checkmark-16.ico">
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
          background: rgb(253,187,45);
          background: -moz-radial-gradient(circle, rgba(253,187,45,1) 40%, rgba(32,190,92,1) 100%);
          background: -webkit-radial-gradient(circle, rgba(253,187,45,1) 40%, rgba(32,190,92,1) 100%);
          background: radial-gradient(circle, rgba(253,187,45,1) 40%, rgba(32,190,92,1) 100%);
          filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#fdbb2d",endColorstr="#20be5c",GradientType=1);
          font-family: Raleway;
        }



        h4, h5 {
          margin: 0;
        }

        html, body {
          height: 100%;
          width: 100%;
        }

        #root {
          width: 90%;
        }

        html {
          text-rendering: geometricPrecision;
        }

        html,
        #success-container,
        #form-container,
        #input-form-msg-container,
        .validation-msg-container,
        .exclusive-access-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        body {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }

        #success-container {
          background-color: lightgreen;
          padding: 2.5% 0;
          border: .5px solid white;
          box-shadow: white 0.25rem 0.25rem 0.5rem;
        }

        .access-announcement {
          text-decoration: underline;
          font-size: 1.75vmax;
        }

        .access-granted,
        .exclusive-access-container,
        #channels-granted,
        #access-guild-link
        {
          font-size: 1.5vmax;
        }


        .exclusive-access-container,
        #self-destruct-message,
        #access-guild-link {
          font-size: 1.25vmax;
        }

        .access-announcement,
        .access-granted,
        #magic-img-container,
        #form-container,
        .validation-msg
        {
          margin: 0 0 1.5% 0;
        }

        #channels-granted {
          margin: 5% 0;
        }

        #input-form-msg-container, .input-form-msg, .validation-msg-container {
          margin: 0 0 1.25% 0;
        }

        #channels-granted, #access-guild-link {
          text-decoration: underline;
          text-decoration-thickness: from-font;
          text-underline-offset: 0.75rem;
        }

        #access-guild-link {
          margin: 1% 0;
        }


        .exclusive-access-container {
          justify-content: center;
        }

        #magic-img-container {
          background: url(https://discord-chatbot-icos.s3.amazonaws.com/dannygoldsmithmagic.png) no-repeat center;
          width: 100%;
          height: 5em;
        }


        #input-form {
          width: 25%;
        }

        #inputs-container {
          display: flex;
        }

        #input-form-text {
          background-color: darkcyan;
          text-align: center;
          flex: 1;
          color: ivory;
        }

        #input-form-text:focus, #input-form-submit:hover {
          background-color: green;
          cursor: pointer;
        }
        #input-form-submit {
          background-color: darkslategray;
          color: ivory;
        }

        #access-guild-link {
          color: darkblue;
        }

        .input-form-input:disabled {
          background-color: gray;
        }

      </style>
    </head>

    <body>
    <div id='root'></div>
        <script type='text/babel'>

        const channelsGranted = ${channelsGranted};
        const discordId = ${discordId};
        const registeredUsersEmail = ${registeredUsersEmail};
        const addEmailIndicator = ${addEmailIndicator};
        const registeredUsername = ${registeredUsername};

        const InputForm = (props) => {
          const [emailVal, setEmailVal] = React.useState('');
          const [submitting, setSubmitting] = React.useState(false);
          const [validationMsgArr, setValidationMsgArr] = React.useState([]);

          React.useEffect(() => {
            if (submitting === true) {
              setEmailVal('');
            }
          }, [submitting]);

          const handleChange = () => {
            setEmailVal(event.target.value)
          };

          const handleSubmit = () => {
            event.preventDefault();
            const savedEmailVal = emailVal;
            setSubmitting(true);
            axios({
              method: "POST",
              url: "https://ws4mcufss9.execute-api.us-east-1.amazonaws.com/prod/event",
              data: {
                data: {
                  email: savedEmailVal,
                  discordId: props.discordId,
                  username: props.registeredUsername,
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
            })
          }

          return (
            <div id='form-container'>
              <div id='input-form-msg-container'>
                <h4 className='input-form-msg'>The email {registeredUsersEmail} was used to register your Guild Subscription</h4>
                <h4 className='input-form-msg'>If you have bought additional dannygoldsmithmagic products with a different email, you can gain access to their exclusive rooms by entering that email or multiple emails here:</h4>
              </div>
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

        const App = (props) => {
          return (
            <div id='success-container'>
              <h4 className='access-announcement'>Welcome to the Guild!</h4>
              <h5 className='access-granted'>Your access has been granted</h5>
              <div id='magic-img-container'></div>
              {(props.channelsGranted.length &&
                  <div className='exclusive-access-container'>
                    <h5>You have also been granted access to the exclusive channels associated with these purchases:</h5>
                    <h4 id='channels-granted'>{props.channelsGranted}</h4>
                  </div>) || ""}
                  <InputForm discordId={props.discordId} registeredUsername={props.registeredUsername} />
                  <a href='https://discord.com/channels/881917878641770577/881917879283515454'>Access the Guild here</a>
            </div>

          )
        }

        const AddEmailApp = (props) => {
          return (
            <div id='success-container'>
              <h4 className='access-announcement'>Success!</h4>
              <div id='magic-img-container'></div>
              <div className='exclusive-access-container'>
                <h5>Your access has been granted to these exclusive channels:</h5>
                <h4 id='channels-granted'>{props.channelsGranted}</h4>
                <div id='input-form-msg-container'>
                  <h5>The email {props.registeredUsersEmail} was used to register your additional products.</h5>
                  <h5>If you have bought additional dannygoldsmithmagic products with a different email you can register them using the registration portal channel inside the Guild</h5>
                </div>
              </div>
              <a id='access-guild-link' href='https://discord.com/channels/881917878641770577/881917879283515454'>Access the Guild here</a>
            </div>
          )
        }

      ReactDOM.render(
        addEmailIndicator ?
        <AddEmailApp
          channelsGranted={channelsGranted}
          registeredUsersEmail={registeredUsersEmail}
        />
        :
        <App
          channelsGranted={channelsGranted}
          discordId={discordId}
          registeredUsersEmail={registeredUsersEmail}
          registeredUsername={registeredUsername}
        />,
        document.getElementById("root")
      );
      </script>
    </body>
  </html>
`
  );
};

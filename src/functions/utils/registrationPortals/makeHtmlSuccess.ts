/* eslint-disable max-len */
import { DiscordChannelsStr, DiscordId, UserEmail, Username } from "types/staticTypes";

/* eslint-disable operator-linebreak */
export const makeHtmlSuccess = (
  verifiedChannelsGranted: DiscordChannelsStr,
  attemptedChannelsGranted: DiscordChannelsStr,
  discordId: DiscordId,
  registeredUsersEmail: UserEmail,
  attemptedUsersEmail: UserEmail,
  registeredUsername: Username,
  redeemerIndicator: boolean
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
          text-underline-offset: .5rem;
        }

        .access-granted,
        .exclusive-access-container,
        #channels-granted,
        .channels-granted-add-email,
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

        .channels-granted-add-email {
          margin: 2% 0 3% 0;
        }

        #input-form-msg-container, .input-form-msg, .validation-msg-container {
          margin: 0 0 1.25% 0;
          font-weight: 500;
          font-size: 1.1vmax;
        }

        #channels-granted,
        .channels-granted-add-email,
        #access-guild-link {
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

        hr {
          margin: 1.75% 0;
          width: 50%;
          border: 1px solid ivory;
          box-shadow:ivory: 0rem .25rem 0.75rem;
        }

        .default-attempted-msg {
          font-weight: 500;
        }

      </style>
    </head>

    <body>
    <div id='root'></div>
        <script type='text/babel'>

        const verifiedChannelsGranted = ${verifiedChannelsGranted};
        const attemptedChannelsGranted = ${attemptedChannelsGranted};
        const discordId = ${discordId};
        const registeredUsersEmail = ${registeredUsersEmail};
        const redeemerIndicator = ${redeemerIndicator};
        const registeredUsername = ${registeredUsername};
        const attemptedUsersEmail = ${attemptedUsersEmail};

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
                <h4 className='input-form-msg'>The email <strong><em>{registeredUsersEmail}</em></strong> was used to register your Guild Subscription</h4>
                <h4 className='input-form-msg'>If you have bought additional dannygoldsmithmagic products with a different email, you can gain access to their exclusive rooms by entering the associated email or emails here:</h4>
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

        const InitialSuccessApp = (props) => {
          return (
            <div id='success-container'>
              <h4 className='access-announcement'>Welcome to the Guild!</h4>
              <h5 className='access-granted'>Your access has been granted</h5>
              <div id='magic-img-container'></div>
              {(props.verifiedChannelsGranted.length &&
                  <div className='exclusive-access-container'>
                    <h5>You have also been granted access to the exclusive channels associated with these purchases:</h5>
                    <h4 id='channels-granted'>{props.verifiedChannelsGranted}</h4>
                  </div>) || ""}
                  <InputForm discordId={props.discordId} registeredUsername={props.registeredUsername} />
                  <a id='access-guild-link' href='https://discord.com/channels/881917878641770577/881917879283515454'>Access the Guild here</a>
            </div>

          )
        }

        const VerificationChannelsGranted = (props) => {
          return (
            <div>
              <h5 className='input-form-msg'>The email <strong><em>{props.registeredUsersEmail}</em></strong> was used to grant your access to the Guild as well as these channels:</h5>
              <h4 className='channels-granted-add-email'>{props.verifiedChannelsGranted}</h4>
            </div>
          )
        }

        const DefaultVerificationMessage = (props) => {
          return (
            <div>
              <h5 className='input-form-msg'>The email <strong><em>{props.registeredUsersEmail}</em></strong> was used to grant your access to the Guild.</h5>
           </div>
          )
        }

        const AttemptedChannelsGranted = (props) => {
          return (
            <div>
              <h5 className='input-form-msg'>The email <strong><em>{props.attemptedUsersEmail}</em></strong> was used to grant access to additional channels.</h5>
              <h4 className='channels-granted-add-email'>{props.attemptedChannelsGranted}</h4>
            </div>
          )
        }

        const DefaultAttemptedMessage = (props) => {
          return (
            <div>
              <h5 className='default-attempted-msg'>By the way, I also looked up <strong><em>{props.attemptedUsersEmail}</em></strong> but didn't find any purchased products related to that email</h5>
            </div>
          )
        }

        const VerificationCompleteApp = (props) => {
          return (
            <div id='success-container'>
              <h4 className='access-announcement'>Welcome to the Guild!</h4>
              <h5 className='access-granted'>Your access has been granted</h5>
              <div id='magic-img-container'></div>
              <div className='exclusive-access-container'>
                {
                  props.verifiedChannelsGranted.length ? <VerificationChannelsGranted {...props} /> : <DefaultVerificationMessage {...props}/>
                }
                {
                  props.attemptedChannelsGranted.length ? <AttemptedChannelsGranted {...props}/> : <DefaultAttemptedMessage {...props}/>
                }
              </div>
              <hr/>
              <div className='future-access-info-container'>
                <h5 className='input-form-msg'>Future exclusive access permissions associated to product purchases with <strong><em>{props.registeredUsersEmail}</em></strong> will <em>automatically</em> be granted.</h5>
                <h5 className='input-form-msg'>Future exclusive access permissions associated to product purchases with <strong><em>{props.attemptedUsersEmail}</em></strong> or other email, can be granted via the registration portal inside the Guild.</h5>
              </div>
              <a id='access-guild-link' href='https://discord.com/channels/881917878641770577/881917879283515454'>Access the Guild here</a>
            </div>
          )
        }

        const VerifiedChannelsOnlyApp = (props) => {
          return (
            <div id='success-container'>
              <h4 className='access-announcement'>Channel Access Granted!</h4>
              <div id='magic-img-container'></div>
              <div className='exclusive-access-container'>
                {
                  props.verifiedChannelsGranted.length
                  ? <AttemptedChannelsGranted
                       attemptedUsersEmail={props.registeredUsersEmail}
                       attemptedChannelsGranted={props.verifiedChannelsGranted}
                    /> : <div>No related channels were found relating to {props.registeredUsersEmail} this error should not show, check to see if you have access and if you still do not please contact info@dannygoldsmithmagic.com</div>
                }
              </div>
              <hr/>
              <div className='future-access-info-container'>
                <h5 className='input-form-msg'>Future exclusive access permissions associated to product purchases with <strong><em>{props.registeredUsersEmail}</em></strong> or other email, can be granted via the registration portal inside the Guild.</h5>
              </div>
              <a id='access-guild-link' href='https://discord.com/channels/881917878641770577/881917879283515454'>Access the Guild here</a>
            </div>
          )
        }

      ReactDOM.render(
      redeemerIndicator && attemptedUsersEmail ?
        <VerificationCompleteApp
          verifiedChannelsGranted={verifiedChannelsGranted}
          attemptedChannelsGranted={attemptedChannelsGranted}
          registeredUsersEmail={registeredUsersEmail}
          attemptedUsersEmail={attemptedUsersEmail}
        />
          : redeemerIndicator ?
            <VerifiedChannelsOnlyApp
              verifiedChannelsGranted={verifiedChannelsGranted}
              registeredUsersEmail={registeredUsersEmail}
            />
            : <InitialSuccessApp
              verifiedChannelsGranted={verifiedChannelsGranted}
              discordId={discordId}
              registeredUsersEmail={registeredUsersEmail}
              registeredUsername={registeredUsername}
              attemptedUsersEmail={attemptedUsersEmail}
            />,
        document.getElementById("root")
      );
      </script>
    </body>
  </html>
`
  );
};

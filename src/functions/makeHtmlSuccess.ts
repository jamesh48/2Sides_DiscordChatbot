/* eslint-disable operator-linebreak */
export const makeHtmlSuccess = (
  channelsGranted: string,
  discordId: string,
  registeredUsersEmail: string
) => {
  console.log("in makeHtmlSuccess", discordId);
  return (
    /* html */
    `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Registration Success</title>
        <link rel="icon" type="image/png" href="https://discord-chatbot-icos.s3.amazonaws.com/checkmark-16.ico">
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
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
          border: .5px solid white;
          justify-content: center;
          padding: 1.5% 0;
          box-shadow: white 0.25rem 0.25rem 0.5rem;
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
          text-decoration: underline;
          text-decoration-thickness: from-font;
          text-underline-offset: 0.75rem;
        }

        .exclusive-access-container, #self-destruct-message {
          font-size: 1.25vmax;
        }

        .exclusive-access-container {
          justify-content: center;
          font-size: 1.5vmax;
        }

        #form-container {
          padding: 1% 0;
        }

        #inputs-container {
          display: flex;
        }
        #success-container,
        #form-container,
        #input-form-msg-container,
        .validation-msg-container,
        .exclusive-access-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .input-form-text {
          background-color: darkcyan;
          text-align: center;
          flex: 1;
        }

        .input-form-text:focus {
          background-color: green;
        }
        .input-form-submit {
          background-color: darkslategray;
        }

        .input-form-submit {
          background-color: green;
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
                <h4>The email {registeredUsersEmail} was used to register your Guild Subscription</h4>
                <h4>If you have bought additional dannygoldsmithmagic products with a different email, you can gain access to their exclusive rooms by entering that email or multiple emails here:</h4>
              </div>
              <div className='validation-msg-container'>
                {validationMsgArr.map((x, i) => {
                  return <p key={i} className='validation-msg'>{x}</p>
                })}
              </div>
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
          console.log('in app', props.discordId)
          return (
            <div id='success-container'>
              <h4 className='access-announcement'>Welcome to the Guild!</h4>
              <h5 className='access-granted'>Your access has been granted</h5>
              {(props.channelsGranted.length &&
                  <div className='exclusive-access-container'>
                    <h5>You have also been granted access to the exclusive channels associated with these purchases:</h5>
                    <h4 id='channels-granted'>{props.channelsGranted}</h4>
                  </div>) || ""}
                  <InputForm discordId={props.discordId}/>
                  <a href='https://discord.com/channels/881917878641770577/881917879283515454'>Access the Guild here</a>
            </div>

          )
        }



      ReactDOM.render(<App channelsGranted={channelsGranted} discordId={discordId} registeredUsersEmail={registeredUsersEmail}/>, document.getElementById("root"));
      </script>
    </body>
  </html>
`
  );
};

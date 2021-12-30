/* eslint-disable operator-linebreak */
export const makeHtmlSuccess = (channelsGranted: string, discordId: string) => {
  return (
    /* html */
    `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Registration Success</title>
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

        #form-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1% 0;
        }

        #inputs-container {
          display: flex;
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

        const InputForm = () => {
          const [emailVal, setEmailVal] = React.useState('');
          const [submitting, setSubmitting] = React.useState(false);

          React.useEffect(() => {
            if (submitting === true) {
              setEmailVal('');
            }
          }, [submitting]);

          const handleChange = () => {
            setEmailVal(event.target.value)
          };

          const handleSubmit = () => {
            setSubmitting(true);
            event.preventDefault();
            axios({
              method: "POST",
              url: "https://2ixnlpbqmi.execute-api.us-east-1.amazonaws.com/prod/event",
              data: {
                data: {
                  email: emailVal,
                  discordId: discordId,
                  command: 'registerAdditionalEmail'
                }
              }
            }).then((response) => {
              console.log(response.data)
            }).finally(() => {
              setSubmitting(false);
            })
          }

          return (
            <div id='form-container'>
              <div id='input-form-msg'>
                <h4>If you have bought dannygoldsmithmagic products with another email, you can associate it here:</h4>
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
          return (
            <div id='success-container'>
              <h4 class='access-announcement'>Welcome to the Guild!</h4>
              <h5 class='access-granted'>Your access has been granted.</h5>
              {(props.channelsGranted.length &&
                  // eslint-disable-next-line max-len
                  <div class='exclusive-access-container'>
                    <h5>You have also been granted access to the exclusive channels associated with these purchases:</h5>
                    <h4 id='channels-granted'>{props.channelsGranted}</h4>
                  </div>) || ""}
                  <InputForm/>
            </div>

          )
        }



      ReactDOM.render(<App channelsGranted={channelsGranted}/>, document.getElementById("root"));
      </script>
    </body>
  </html>
`
  );
};

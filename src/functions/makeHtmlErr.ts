export const makeHtmlErr = (errMessage: string, discordId: string) => {
  return (
    /* html */
    `<!DOCTYPE html>
<html>
  <head>
    <title>Registration Error</title>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
      <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <style>
    html {
      background: rgb(0,0,0);
      background: -moz-radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(121,9,83,1) 100%);
      background: -webkit-radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(121,9,83,1) 100%);
      background: radial-gradient(circle, rgba(0,0,0,1) 40%, rgba(121,9,83,1) 100%);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#000000",endColorstr="#790953",GradientType=1);
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
        background-color: lightcoral;
        border: 2px solid black;
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

      #redeemer-input-submit {
        background-color: darkslategray;
      }

      #redeemer-input-submit:hover {
        background-color: green;
      }

    </style>
  </head>

  <body>
    <div id='root'></div>

    <script type='text/babel'>
      const errMessage = ${errMessage};
      const discordId = ${discordId};

      const InputForm = (props) => {
        const [emailVal, setEmailVal] = React.useState("");
        const [validationContainerMsg, setValidationContainerMsg] = React.useState([null, ""]);
        const [submitting, setSubmitting] = React.useState(false);

        const handleChange = () => {
          setEmailVal(event.target.value);
        };

        const handleSubmit = () => {
          event.preventDefault();
            setSubmitting(true);
            const memoedEmailVal = emailVal;
            setEmailVal("");

            axios({
              method: 'POST',
              url: 'https://2ixnlpbqmi.execute-api.us-east-1.amazonaws.com/prod/event',
              data: {
                data: {
                  discordId: props.discordId,
                  email: memoedEmailVal
                }
              }
            }).then((response) => {
                if (response.data.indexOf("not found") > -1 || response.data.indexOf("already registered") > -1) {
                  setValidationContainerMsg(["error", response.data]);
                } else {
                  setValidationContainerMsg(["success", response.data])
                }
              }).finally(() => {
                setSubmitting(false);
              })
        };

        return (
          <form onSubmit={handleSubmit} id='error-redeemer-form'>
            {validationContainerMsg[0] === 'error' && <div id='validation-container'>{validationContainerMsg[1]}</div>}
            {validationContainerMsg[0] === 'success' ?
            <div id='validation-container'>{validationContainerMsg[1]}</div> :
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
            <h3>There was an error with your Registration:</h3>
            <div id='error-message-container'>
            {props.errMessage
                .split("\\n")
                .map((x) => <p className='error-detail'>{x}</p>)
            }
            </div>
            {/* If Verification Fails do not show the input */}
            {props.errMessage.indexOf('404: Verification failed:') === -1 && <InputForm discordId={props.discordId}/>}
        </div>
          )
      }

      ReactDOM.render(<App errMessage={errMessage} discordId={discordId}/>, document.getElementById("root"));

      </script>
    </div>
  </body>
</html>`
  );
};

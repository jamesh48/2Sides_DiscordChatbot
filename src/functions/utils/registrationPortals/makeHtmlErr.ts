export const makeHtmlErr = (errMessage: string) => {
  return (
    /* html */
    `<!DOCTYPE html>
<html>
  <head>
    <title>Registration Error</title>
      <link rel="icon" type="image/png" href="https://discord-chatbot-icos.s3.amazonaws.com/x-mark-16.ico">
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

      #redeemer-input-text:disabled {
        background-color: gray;
      }

      #redeemer-input-submit {
        background-color: darkslategray;
      }

      #redeemer-input-submit:hover {
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

      const App = (props) => {
        return (
          <div id='error-container'>
            <h3>There was an error with your Registration:</h3>
            <div id='error-message-container'>
            {props.errMessage
                .split("\\n")
                .map((x, i) => <p key={i} className='error-detail'>{x}</p>)
            }
            </div>
        </div>
          )
      }

      ReactDOM.render(<App errMessage={errMessage}/>, document.getElementById("root"));

      </script>
    </div>
  </body>
</html>`
  );
};

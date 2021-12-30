export const makeRegistrationPortal = () => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Registration Portal</title>
      <style>
        html, body {
          height: 100%;
        }

        #root {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid black;
        }

        #app-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #email-form {
          display: flex;
          flex-direction: column;
        }

        #explanation-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .email-input {
          text-align: center;
        }
      </style>

      <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
      <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    </head>

    <body>
      <div id="root"></div>
        <script type='text/babel'>

          const App = () => {
            const [inputCount, setInputCount] = React.useState(1);
            const [emailVal, setEmailVal] = React.useState('');

            const handleSubmit = () => {
              event.preventDefault();
              window.open('https://www.google.com');
            }

            const handleChange = () => {
              setEmailVal(event.target.value)
            }

            const handleAddEmailClick = () => {
              setInputCount(ex => ex + 1);
            }

            return (
              <div id='app-container'>
                <div id='explanation-container'>
                  <h4>Instructions</h4>
                  <p>If your Discord Email matches the email that you bought the Guild Subscription with as well as additional products with simply click submit</p>
                  <p>Otherwise please change the email below to match the email that you purchased the guild subscription with</p>
                  <p>You can also enter additional emails if you purchased multiple products with different emails.</p>
                  <p>Keep in mind that an email is only good for one guild subscription</p>
                </div>
                <div id='form-container'>
                  <form onSubmit={handleSubmit} id='email-form'>
                    <input type='text' placeholder='email' onChange={handleChange} value={emailVal} className='email-input'></input>
                    <input type='button' value='Add Email?' onClick={handleAddEmailClick}></input>
                    <input type='submit'></input>
                  </form>
                </div>
              </div>
            )
          }

          ReactDOM.render(<App/>, document.getElementById("root"));
        </script>
    </body>
  </html>
`
};

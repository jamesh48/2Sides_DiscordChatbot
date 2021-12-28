export const makeHtmlErr = (errMessage: string) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Registration Error</title>
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

      #error-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90%;
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
        width: 50%;
        padding: 0 2%;
      }

      .error-detail {
        font-size: 1.25vmax;
      }
    </style>
  </head>

  <body>
    <div id='error-container'>
      <h3>There was an error with your Registration:</h3>
      <div id='error-message-container'>${errMessage
    .slice(1, -1)
    .split("\\n")
    .map((x) => `<p className='error-detail'>${x}</p>`)
    .join("")}
      </div>
      <form>
        <input type='button' onClick={window.open("https://www.google.com")}></input>
      </form>
    </div>
  </body>
</html>`;

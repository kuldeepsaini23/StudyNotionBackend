exports.contactusResponsetemplate = (doc) => {
  const { firstName, lastName, email, phoneNumber, message } = doc;
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8">
      <title>Password Update Confirmation</title>
      <style>
          body {
              background-color: #ffffff;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.4;
              color: #333333;
              margin: 0;
              padding: 0;
          }
  
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
          }
  
          .logo {
              max-width: 200px;
              margin-bottom: 20px;
          }
  
          .message {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 20px;
          }
  
          .body {
              font-size: 16px;
              margin-bottom: 20px;
          }
  
          .support {
              font-size: 14px;
              color: #999999;
              margin-top: 20px;
          }
  
          .info_container{
            border: 1px solid #61636a;
            max-width: 400px;
            margin: 0 auto;
            padding: 10px;
            text: center;
        }
        
        .inside_cont{
            display: flex;
            gap: 0.2rem;
            justify-content: center;
            align-items: center;
        }

      </style>
  
  </head>
  
  <body>
      <div class="container">
          <a href="https://studynotion-edtech-project.vercel.app"><img class="logo"
                  src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo"></a>
          <div class="message">Response Confirmation</div>
          <div class="body">
              <h2>Hey ${firstName} ${lastName},</h2>
              <h1>Thanks for your response.</h1>
              <p>The below is your response</p>
          </div>
          <div class="info_container">
              <div class="inside_cont">
                  <h4>First Name: ${firstName}</h4>
              </div>

              <div class="inside_cont">
                  <h4>Last Name: ${lastName}</h4>
              </div>

              <div class="inside_cont">
                  <h4>Email Address: ${email}</h4>
              </div>

              <div class="inside_cont">
                  <h4>Phone Number: ${phoneNumber}</h4>
              </div>

              <div class="inside_cont">
                  <h4>Message: ${message}</h4>
              </div>
          </div>
          <div class="support">If you have any questions or need further assistance, please feel free to reach out to us
              at
              <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!
          </div>
      </div>
  </body>
  
  </html>`;
};

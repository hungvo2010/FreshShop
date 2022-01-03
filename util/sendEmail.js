const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const path = require('path');
const OAuth2 = google.auth.OAuth2;

require('dotenv').config({path: path.join(__dirname, '.env')});

module.exports = (email) => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID, // ClientID
        process.env.CLIENT_SECRET, // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
   );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });
    const accessToken = oauth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: process.env.USER_EMAIL, 
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken
       },
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'Sign Up Successfully',
        text: 'Click this link to verify your account',
    };

    transporter.sendMail(mailOptions, (err, response) => {
        err ? console.log(err) : console.log(response);
        transporter.close();
    });
}
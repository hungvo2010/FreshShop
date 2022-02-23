const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const path = require('path');
const OAuth2 = google.auth.OAuth2;

require('dotenv').config({path: path.join(__dirname, '.env')});

class Email {
    constructor(email){
        this.to = email;
        this.from = process.env.USER_EMAIL
    }

    createTransport(){
        // if (process.env.NODE_ENV === 'development') {
        //     return nodemailer.createTransport({
        //       host: process.env.EMAIL_HOST,
        //       port: process.env.EMAIL_PORT,
        //       secure: false,
        //       auth: {
        //         user: process.env.EMAIL_USERNAME,
        //         pass: process.env.EMAIL_PASSWORD
        //       }
        //     });
        //   }
        // if (process.env.NODE_ENV === 'production') {
        //     //Sendgrid
        //     return nodemailer.createTransport({
        //         service: 'SendGrid',
        //         auth: {
        //         user: process.env.SENDGRID_USERNAME,
        //         pass: process.env.SENDGRID_PASSWORD
        //         }
        //     });
        // }
        const oauth2Client = new OAuth2(
            process.env.CLIENT_ID, // ClientID
            process.env.CLIENT_SECRET, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );
        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        });
        const accessToken = oauth2Client.getAccessToken();
        return nodemailer.createTransport({
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
    }

    async send(templateHtml, subject){
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html: templateHtml,
        };
        await this.createTransport().sendMail(mailOptions);
    }

    async sendPasswordReset(templateHtml) {
        await this.send(
           templateHtml,
          'Your password reset token (valid for only 10 minutes)'
        );
      }
}

module.exports = Email;
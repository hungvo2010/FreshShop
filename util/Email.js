const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const { google } = require("googleapis");
const path = require('path');
const OAuth2 = google.auth.OAuth2;
const ejs = require('ejs');

require('dotenv').config({path: path.join(__dirname, '.env')});

class Email {
    constructor(){
        this.dev = process.env.NODE_ENV !== 'production';
        this.from = dev ? process.env.SENDER_EMAIL_TEST : process.env.SENDER_EMAIL_LIVE;
    }

    createTransport(){
        if (this.dev){ // development or test
            const oauth2Client = new OAuth2(
                process.env.CLIENT_ID, // ClientID
                process.env.CLIENT_SECRET, // Client Secret
                "https://developers.google.com/oauthplayground" // Redirect URL
            );
            oauth2Client.setCredentials({
                refresh_token: process.env.REFRESH_TOKEN
            });
            return nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: "OAuth2",
                    user: this.from, 
                    clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
        }

        else {
            return nodemailer.createTransport(
                nodemailerSendgrid({
                    apiKey: process.env.SENDGRID_API_KEY
                })
            );
        }
    }
    
    async send(...args){
        const [template, subject, mailTo] = args;
        const html = await ejs.renderFile(path.join(__dirname, "../views/emails", `${template}.pug`));
        const mailOptions = {
            from: this.from,
            to: mailTo,
            subject,
            html,
        };
        await this.createTransport().sendMail(mailOptions);
    }

    async sendPasswordReset() {
        await this.send(
           'reset',
          'Your password reset token (valid for only 10 minutes)'
        );
    }

    async sendEmailWelcome() {
        await this.send(
           'welcome',
          'Welcome to FreshShop'
        );
    }
}

module.exports = Email;
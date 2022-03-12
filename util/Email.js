const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const { google } = require("googleapis");
const path = require('path');
const OAuth2 = google.auth.OAuth2;
const ejs = require('ejs');
const getRootUrl = require('../util/getRootUrl');

require('dotenv').config({path: path.join(__dirname, '.env')});

class Email {
    constructor(){
        this.dev = process.env.NODE_ENV !== 'production';
        this.from = this.dev ? process.env.SENDER_EMAIL_TEST : process.env.SENDER_EMAIL_LIVE;
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
        const [mailTo, template, options, subject] = args;
        const html = await ejs.renderFile(path.join(__dirname, "../views/emails", `${template}.ejs`), options);
        const mailOptions = {
            from: this.from,
            to: mailTo,
            subject,
            html,
        };
        await this.createTransport().sendMail(mailOptions);
    }

    async sendPasswordReset(mailTo, token) {
        const mailOptions = {
            rootUrl: getRootUrl(),
            contactUs: getRootUrl() + '/contact-us',
            replyTo: this.from,
            token,
            mailTo,
        }
        await this.send(
            mailTo,
            'reset',
            mailOptions,
            'Your password reset token (valid for only 10 minutes)',
        );
    }

    async sendEmailWelcome(mailTo) {
        const mailOptions = {
            rootUrl: getRootUrl(),
            contactUs: getRootUrl() + '/contact-us',
            replyTo: this.from,
            mailTo,
        }
        await this.send(
            mailTo,
            'welcome',
            mailOptions,
            'Welcome to FreshShop'
        );
    }
}

module.exports = Email;
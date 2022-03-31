# mvc-sequelize
Simple web application to sell fresh things like vegetables, fruits.

## Live app:


## Technical

On the browser, I utilizes free template: https://www.free-css.com/free-css-templates/page246/freshshop.
On the server, the main technologies I use are: Node.js, Express.js, Prisma, MySQL.

## Run locally

- Clone the project and run `npm install` to add packages.
- Before you start the app, create a `.env` file at the app's root. This file must have values for some env variables specified below.
  - To get `MONGO_URL_TEST`, we recommend a [free MongoDB at MongoDB Atlas](https://docs.mongodb.com/manual/tutorial/atlas-free-tier-setup/) (to be updated soon with MongoDB Atlas, see [issue](https://github.com/async-labs/builderbook/issues/138)).
  - Get `GOOGLE_CLIENTID` and `GOOGLE_CLIENTSECRET` by following [official OAuth tutorial](https://developers.google.com/identity/sign-in/web/sign-in#before_you_begin).

    Important: For Google OAuth app, callback URL is: http://localhost:8000/oauth2callback <br/>
    Important: You have to enable Google+ API in your Google Cloud Platform account.

  - Specify your own secret key for Express session `SESSION_SECRET`: https://github.com/expressjs/session#secret
- Start the app with `npm run dev`.

**Important: if you don't add values for environmental variables to `.env` file, corresponding functionality will not work. For example, login with Google account, purchasing book, getting repo information via GitHub API and other third-party API infrastructures.**

## License

All code in this repository is provided under the [MIT License](https://github.com/hungvo2010/mvc-sequelize/blob/main/LICENSE).
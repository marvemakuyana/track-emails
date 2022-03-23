const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  let mailOptions = {
    from: "examples@gmail.com",
    to: "examples@gmail.com, examples@gmail.com",
    subject: "Test email",
    text: "Hello world... Sent from Node.js",
  };

  transporter.sendMail(mailOptions, function (error, data) {
    if (error) {
      console.log("Error " + error);
    } else {
      res.send("Email sent successfully");
    }
  });
});

module.exports = router;

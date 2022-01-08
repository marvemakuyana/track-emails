const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.get('/', async (req, res) => {

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});

let mailOptions ={
    from: 'marve5050@gmail.com',
    to: 'marvellousmakuyana@gmail.com, marve5050@gmail.com',
    subject: 'Test',
    text: 'Hi there...'
};

transporter.sendMail(mailOptions, function(error, data){
    if(error){
        console.log('Error ' + error);
    } else{
        res.send('Email sent successfully');
    }
});



});
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server started...'));
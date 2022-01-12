const express = require('express');
const router = express.Router();
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

router.get('/', (req, res) => {
    
const SCOPES = ['https://mail.google.com/'];

const TOKEN_PATH = 'token.json'; 


fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
 
    authorize(JSON.parse(content), addMessages);
});


function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    }); 
}


function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function addMessages(auth, query){
   
    return new Promise((resolve,reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.modify({
            userId: 'me', 
            id: '17e3eaed8ba85aa4',
            resource: {          
                addLabelIds: 'Label_10',                
              },  
          
        },(err,result) => {
            if(err){
                reject(err);
                res.send('The API returned an error: ' + err);
            }
            resolve(result);
            res.send('Label has been added')

        }
        );
    })
}

});

module.exports = router;
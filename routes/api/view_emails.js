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
 
    authorize(JSON.parse(content), listEmailMessages);
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

function listEmailMessages(auth, query){
    query = 'sarah@pdffiller.com';
    //return new Promise((resolve,reject) => {
        const gmail = google.gmail({version: 'v1', auth});
        gmail.users.messages.list({
            userId: 'me', 
            q: query,
            maxResults: 5
          
        },(err,result) => {
            if(err){
                res.send(err);
               // return;
            }
            // if(!result.data.messages){
            //     resolve([]);
            //     return;
            // }
            // resolve(result.data);
            printMessage(result.data.messages, auth)

        }
        );
   // })
}

function printMessage(messageID, auth){
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.messages.get({
        userId: 'me',
        id: messageID[0].id
    }, (err, result) => {
        messageID.splice(0,1);
        if(messageID.length > 0){
            printMessage(messageID,auth)
        } else{
            res.send(result.data)
           // res.send('Completed...')
        }
    }
    );
}

});

module.exports = router;
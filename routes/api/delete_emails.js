const express = require('express');
const router = express.Router();
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const lineByLine = require('n-readlines');

router.get('/', (req, res) => {
    
const SCOPES = ['https://mail.google.com/'];

const TOKEN_PATH = 'token.json'; 


fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
 
    authorize(JSON.parse(content), deleteMessageWrapper);
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


getFilterList = (fileName) => {
    const filteringList = [];
    const liner = new lineByLine(fileName);
    let line;

    while((line = liner.next())){
        filteringList.push(line.toString('utf8'));
    }
    return filteringList;

}

async function getMessagesByFilter(auth, filter, token ='', result = []){
    const gmail = google.gmail({version: 'v1', auth});
    let res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 500,
        pageToken: token,
        q: filter,
    });

    if(res && res.data) {
        let messages = res.data.messages;
        if(messages && messages.length) {
            messages.forEach((message) => result.push(message.id));
            if(res.data.nextPageToken){
                result = await getMessagesByFilter(
                    auth,
                    filter,
                    res.data.nextPageToken,
                    result
                );
            }
        }
    }
    return result;
}

async function deleteBatch(auth, list) {
    const gmail = google.gmail({ version: 'v1', auth});
    let res = await gmail.users.messages.batchDelete({
        userId: 'me',
        resource: {ids: list}
    });
}

async function deleteMessageWrapper(auth){
    console.log(`Started deleting emails ...` );
    const batchLimit = 50;
    const filteringList = getFilterList('filterlist.text');
    let finalResult = [];
    let result = await filteringList.forEach(async (item) => {
        let result = await getMessagesByFilter(auth, item);
        let noOfBatches = Math.ceil(result.length / batchLimit);
        for(let i = 0; i < noOfBatches; i++){
            let ids = [];
            for(let j = i * batchLimit; j < i * batchLimit + batchLimit; j++){
                if(result[j]){
                    ids.push(result[j]);
                } else {
                    break;
                }
            }
            let resultNew = await deleteBatch(auth, ids);
        }
        finalResult.push({
            Filter: item,
            Mails_Fetched: result.length,
        });
        if(filteringList.length === finalResult.length){
            console.log(`Deleted items...` );
            res.send(finalResult)
        }
    })
}
});

module.exports = router;
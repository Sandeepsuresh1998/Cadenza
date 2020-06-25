const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({origin: true}));

const client_id = "590b668627a84848bef50731584143d4";
const client_secret = "d2774fe9334d458d84b999d6065bc5ba";
const redirect_uri = "localhost:3000";

var querystring = require('querystring');
var stateKey = 'spotify_auth_state';

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

app.get('/getCredentials', (req, res) => {
    
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    var scope = 'user-read-private user-read-email';

    res.status(200).send({
        client_id, 
        client_secret,
        redirect_uri,
        scope,
        state
    });
})

exports.api = functions.https.onRequest(app);
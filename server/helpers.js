var axios = require('axios');
var querystring = require('querystring');
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var request = require('request'); // "Request" library


async function getNewAccessToken(refreshToken) {
    console.log(client_secret)
    // requesting access token from refresh token
    // var authOptions = {
    //     url: 'https://accounts.spotify.com/api/token',
    //     headers: { 'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64') },
    //     form: {
    //         grant_type: 'refresh_token',
    //         refresh_token: refreshToken
    //     },
    //     json: true
    // } 
    // console.log("Making new access token")

    // return new Promise()
    // request.post(authOptions, function(error, response, body) {
    //     if (!error && response.statusCode === 200) {
    //         var access_token = body.access_token;
    //         console.log(access_token);
    //         return access_token;
    //     } else {
    //         console.log("Internal error")
    //         return -1;
    //     }
    // });


    console.log(typeof(refreshToken));
    const resp = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
        grant_type: 'refresh_token', 
        refresh_token: refreshToken
    }), {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => {
        console.log(response.data);
        // TODO: Update db
        return response.data.access_token
    }).catch(err => {
        console.log(err.message);
    });

    return resp;
}

module.exports = {getNewAccessToken}
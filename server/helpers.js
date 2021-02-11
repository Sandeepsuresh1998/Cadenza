var axios = require('axios');
const { response } = require('express');
var querystring = require('querystring');
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var request = require('request'); // "Request" library

function findMatchingTracks(myTrackList, otherTrackList) {
    return myTrackList
}

async function getNewAccessToken(refreshToken) {

    const token = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
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
    return token;
}

function getTracksHelper(timeRange, accessToken) {
    //Create header
    const config = {
        headers: {Authorization : `Bearer ${accessToken}`},
    }
    
    return axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=" + timeRange, config).then(response => {
        
    })
}

async function getSharedTracks(myAccessToken, otherAccessToken) {
    //All the requests for all the different ranges we get access to

    console.log("Sending this access: " + myAccessToken);
    console.log("Sending this otherAccessToken: " + otherAccessToken);

    const similarTracks = await axios.all([
        getTracksHelper('short_term', myAccessToken),
        getTracksHelper('medium_term', myAccessToken),
        getTracksHelper('long_term', myAccessToken),
        getTracksHelper('short_term', otherAccessToken),
        getTracksHelper('medium_term', otherAccessToken),
        getTracksHelper('long_term', otherAccessToken)
    ]).then(axios.spread((...responses) => {
        console.log(responses[0])
    })).catch(error => {
        console.log(error);
    });
    return similarTracks;
}


module.exports = {getNewAccessToken, getSharedTracks}
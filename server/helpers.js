var axios = require('axios');
const { response } = require('express');
var querystring = require('querystring');
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var request = require('request'); // "Request" library

function findMatchingTracks(myTracks, otherTracks) {
    
    //Should be same size
    if(myTracks.length != otherTracks.length) {
        console.log("Mismatch")
    }

    //TODO: Review algorithms to see if there is faster way to do this
    // O(n^2)
    intersection = []
    for (i in myTracks) {
        for (k in otherTracks) {
            if(myTracks[i].id == otherTracks[k].id) {
                intersection.push(myTracks[i]);
            }
        }
    }

    //Intersectoin of top songs
    for (i in intersection) {
        console.log(intersection[i].name)
    }
    
    return intersection;
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

function compareTwoSongs(track1, track2) {
    return track1.id == track2.id;
}

function getTracksHelper(timeRange, accessToken) {
    //Create header
    const config = {
        headers: {Authorization : `Bearer ${accessToken}`},
    }
    
    return axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=" + timeRange,config).then(response => response.data.items)
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
        myTracks = [...responses[0], ...responses[1],...responses[2]]
        otherTracks = [...responses[3], ...responses[4],...responses[5]]
        return findMatchingTracks(myTracks, otherTracks)
    })).catch(error => {
        console.log(error);
    });
    return similarTracks;
}


module.exports = {getNewAccessToken, getSharedTracks}
var axios = require('axios');
const { promises } = require('dns');
const { response } = require('express');
var querystring = require('querystring');
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var request = require('request'); // "Request" library

function findMatchingItems(myItems, otherItems) {

    console.log(myItems.length)
    console.log(otherItems.length)

    //TODO: Review algorithms to see if there is faster way to do this
    // O(n^2)
    idIntersection = new Set();
    sharedItems = []
    for (i in myItems) {
        for (k in otherItems) {
            if(myItems[i].id == otherItems[k].id && !idIntersection.has(myItems[i].id)) {
                sharedItems.push(myItems[i]);
                idIntersection.add(myItems[i].id);
            }
        }
    }

    //Intersection of top songs
    for (i in sharedItems) {
        console.log(sharedItems[i].name);
    }
    
    return sharedItems;
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

function getArtistsHelper(timeRange, accessToken) {
    //Create header
    const config = {
        headers: {Authorization : `Bearer ${accessToken}`},
    }

    return axios.get("https://api.spotify.com/v1/me/top/artists?time_range=" + timeRange + "&limit=50", config).then(response => response.data.items)
}

function getFriendshipToken(myUserId, otherUserId) {
    // Set ordering for id
    var firstId = otherUserId;
    var secondId = myUserId;
    if(myUserId < otherUserId) {
      firstId = myUserId;
      secondId = otherUserId
    } 

    result = {
        firstId,
        secondId, 
        'friendshipToken' : firstId+secondId
    }

    return result;

}
function getTracksHelper(timeRange, accessToken) {
    //Create header
    const config = {
        headers: {Authorization : `Bearer ${accessToken}`},
    }
    
    return axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=" + timeRange + "&limit=50",config).then(response => response.data.items)
    .catch(err => {
        console.log(err);
    })
}


/*  TODO: 
    This needs to be buried for now because I can't figure out how to unwrap
    all the promises returned to me from the playlists into the og req. That 
    being said, this will be important in the future to get better results 
    from shared tracks, as it increases the volume of songs we look at 
    exponentially (~150 -> 1000+) in my small test cases.
*/
async function getAllPlaylistTracks(accessToken) {
    //Create header
    const config = {
        headers: {Authorization : `Bearer ${accessToken}`},
    }

    //First get all the playlist ids, max limit 50
    let playlistPromises = []

    return axios.get("https://api.spotify.com/v1/me/playlists?limit=50", config).then(response => {
        //Extract ids from response
        const playlistIds = response.data.items.map(item => item.id);
        console.log(`Number of playlists: ${playlistIds.length}`);
        //For each id get as many tracks as you can
        const playlistPromises = playlistIds.map(id => {
            return getTracksForSinglePlaylist(id, accessToken)
        });
        //Have all the playlist promises
        return axios.all(playlistPromises).then(res => {
            //Push all playlist track objs into an array
            allTracks = [].concat(...res)
            console.log("All tracks in my function call");
            console.log(allTracks.length)
            return allTracks;
        });
    }).catch(error => {
        console.log(error);
    })
}


async function getTracksForSinglePlaylist(id, accessToken) {
    //Create header
    const config = {
        headers: {Authorization : `Bearer ${accessToken}`},
    }

    let playlistTracks = await axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=100`, config).then(res => res.data.items);
    return playlistTracks;
}

async function getSharedPlaylistTracks(myAccessToken, otherAccessToken) {
    var playlistTracks = await getAllPlaylistTracks(myAccessToken).then(myPlaylistTracksRes => {
        
        return getAllPlaylistTracks(otherAccessToken).then(otherPlaylistTracksRes => {
            console.log("Other playlist tracks: ");
            console.log(otherPlaylistTracksRes.length);
            return findMatchingItems(myPlaylistTracksRes,otherPlaylistTracksRes)
        });
    })

    return playlistTracks;
}

async function getSharedTopTracks(myAccessToken, otherAccessToken) {
    //All the requests for all the different ranges we get access to

    var allSharedTracks = await axios.all([
            getTracksHelper('short_term', myAccessToken),
            getTracksHelper('medium_term', myAccessToken),
            getTracksHelper('long_term', myAccessToken),
            getTracksHelper('short_term', otherAccessToken),
            getTracksHelper('medium_term', otherAccessToken),
            getTracksHelper('long_term', otherAccessToken),
    ]).then(axios.spread((...responses) => {
        //console.log("Response lengths: " + (responses.length));
        myTracks = [...responses[0], ...responses[1],...responses[2]];
        otherTracks = [...responses[3], ...responses[4],...responses[5]];
        return findMatchingItems(myTracks, otherTracks);
    })) 

    return allSharedTracks;
}

async function getSharedArtists(myAccessToken, otherAccessToken) {
    const similarArtists = await axios.all([
        getArtistsHelper('short_term', myAccessToken),
        getArtistsHelper('medium_term', myAccessToken),
        getArtistsHelper('long_term', myAccessToken),
        getArtistsHelper('short_term', otherAccessToken),
        getArtistsHelper('medium_term', otherAccessToken),
        getArtistsHelper('long_term', otherAccessToken)
    ]).then(axios.spread((...responses) => {
        myTracks = [...responses[0], ...responses[1],...responses[2]]
        otherTracks = [...responses[3], ...responses[4],...responses[5]]
        return findMatchingItems(myTracks, otherTracks)
        
    })).catch(error => {
        console.log(error);
    });

    return similarArtists;
}


module.exports = {getNewAccessToken, getSharedTopTracks, getSharedPlaylistTracks, getSharedArtists, getFriendshipToken}
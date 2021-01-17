var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
var redirect_uri =  process.env.REDIRECT_URI || 'http://localhost:8888/callback'; // Your redirect uri
var SpotifyWebApi = require('spotify-web-api-node');
var axios = require('axios');
const CircularJSON = require('circular-json');
const { query } = require('express');
var admin = require("firebase-admin");
var serviceAccount = require("./musictaste-8ca96-firebase-adminsdk-tnkge-cf9e068aa9.json");
const { firestore } = require('firebase-admin');

// Initializing database access
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://musictaste-8ca96.firebaseio.com"
});

const db = admin.firestore();


//Creating an instance of the api we are going to hit 
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret, 
  redirectUri: redirect_uri
})

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) =>  {

  console.log('Hit login')

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read user-read-recently-played playlist-read-private user-read-currently-playing';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

//FUNCTION: Call back after login 
app.get('/callback', (req, res) =>  {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        // TODO: If user exists, run suite of information grabs.

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
          
          const userData = {
            name: body.display_name,
            email: body.email,
            userId: body.id,
            access_token: access_token,
            refresh_token: refresh_token, 
            img: body.images[0].url,
            last_login: firestore.Timestamp.now()
          }

          // Creating a user in the db
          // Doesn't seem to add duplicates
          // Though i think this is just rewriting everything which is no bueno
          db.collection("Users").doc(body.id).set(userData);
          
        });

        // we can also pass the token to the browser to make requests from there
        // specifically we are routing back to the home page
        console.log("Redirecting now");
        res.redirect('http://localhost:3000/home?' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// FUNCTION: Get refresh token 
// Note: not sure if this works
app.get('/refresh_token', (req, res) =>  {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64') },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  //Debug
  console.log(client_id);

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token,
      });
    } else {
      res.send(response);
    }
  });
});

// TODO: Error checking in firebase call
// FUNCTION: Get all users in the database
app.get('/getAllUsers', (req, res) => {
  var users = [];
  db.collection("Users").get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.data());
      users.push(doc.data());
    })
    res.send(users).status(200);
  })

});

app.post('/getNewAccessToken', (req, res) => {
  const refreshToken = req.query.refreshToken;

  const params = {
    grant_type: "refresh_token", 
    refresh_token: refreshToken
  }

  axios.post('https://accounts.spotify.com/api/token', params, {
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    }
  }).then(response => {
    console.log("New access token: " + response.data);
    res.send(response.data);
  })
})


// FUNCTION: Get information about user
app.get('/myInfo', (req, res) =>  {
  // Get a users' top artists
  const accessToken = req.query.accessToken;
  if(!accessToken) {
    return res.status(500).send("Can't find access token");
  }

  // Set the accessToken
  spotifyApi.setAccessToken(accessToken);

  //Get the top tracks
  spotifyApi.getMe().then((data) => {
    console.log(data);
    // TODO: Error checking
    res.send(data).status(200);
  })

});

// FUNCTION: get playlists for a user
// access token to specify user is passed in
app.get('/getPlaylists', (req, res) => { 
  const accessToken = req.query.accessToken;
  if(!accessToken) {
    return res.status(500).send("Can't find access token");
  }

  //Create header
  const config = {
    headers: {Authorization : `Bearer ${accessToken}`}
  }

  axios.get("https://api.spotify.com/v1/me/playlists", config).then((response) => {
      // Fixing problem of circular json not sure why this is needed
      // let json = CircularJSON.stringify(data);
      console.log("Request went fine");
      return res.send(response.data).status(200);
  }).catch((err) => {
      console.log("We caught something" + err);
      return res.status(500).send(err);
  });

});


//FUNCTION: Get top currently playing song
app.get('/getNowPlaying', (req, res) => {
  const accessToken = req.query.accessToken;
  if(!accessToken) {
    return res.status(500).send("Can't find access token");
  }

  //Create header
  const config = {
    headers: {Authorization : `Bearer ${accessToken}`}
  }

  axios.get("https://api.spotify.com/v1/me/player/currently-playing", config).then((response) => {
    console.log(response)
    return res.send(response.data);
  }).catch((err) => {
    console.log(err);
    return res.send(err);
  });
})

// FUNCTION: Get top artists
app.get('/getTopArtists', (req,res) => {
  const accessToken = req.query.accessToken;
  if(!accessToken) {
    return res.status(500).send("Can't find access token");
  }

  //Create header
  const config = {
    headers: {Authorization : `Bearer ${accessToken}`}
  }

  axios.get("https://api.spotify.com/v1/me/top/artists", config).then((response) => {
    console.log("Got top artists");
    return res.send(response.data).status(200);
  }).catch((err) => {
    console.log("Error" + err);
    return res.send(err);
  });

});

// FUNCTION: Get top tracks
app.get('/getTopTracks', (req,res) => {
  const accessToken = req.query.accessToken;
  if(!accessToken) {
    return res.status(500).send("Can't find access token");
  }


  // TODO: Change default to medium term
  let queryTimeRange = 'short_term'
  if(req.query.timeRange) {
    queryTimeRange = req.queryTimeRange;
  }

  //Create header
  const config = {
    headers: {Authorization : `Bearer ${accessToken}`},
  }

  // TODO: Make this variable passed in during the request
  let data = {
    params: {
      'time_range' : 'short_term',
    }
  }


  axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=" + queryTimeRange, config).then((response) => {
    console.log("Got top artists");
    return res.send(response.data).status(200);
  }).catch((err) => {
    console.log("Error" + err);
    return res.send(err);
  });

});


//FUNCTION: Return matches in two users' top tracks
app.get('/getSharedTopTracks', (req, res) => {

  //In the parameters we have two user ids
  //Return top tracks in short, medium, long term
  //NOTE: This might be expensive at scale because im not saving anything

  console.log(req.query);

  //For now by "my" I mean the logged in user
  const myUserId = req.query.me;
  const otherUserId = req.query.other;
  var myRefreshToken;
  var otherRefreshToken;

  //Hit Db for acess_tokens from each
  //Get user's access and refresh
  const myObj = db.collection("Users").doc(myUserId).get().then(doc => {
    if(!doc.exists) {
      res.send("Unable to find logged in user").status(500);
    }
    myRefreshToken = doc.data().refresh_token;
    axios.post("/getNewAccessToken", {
      refreshToken: myRefreshToken
    }).then(response => {
      console.log("We are back from the post with the new access token");
    })
  }).catch(err => {
    res.send(err).status(501);
  }) 

  //Get other's access and refresh
  const otherObj = db.collection("Users").doc(otherUserId).get().then(doc => {
    if(!doc.exists) {
      res.send("Unable to find logged in user").status(500);
    }
    otherRefreshToken = doc.data().refresh_token;
  }).catch(err => {
    res.send(err).status(501);
  });

  

});


app.listen(process.env.PORT || 8888);
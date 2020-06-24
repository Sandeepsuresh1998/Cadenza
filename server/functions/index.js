const functions = require('firebase-functions');
const app = require('express')();                   // express allows you to have end points with the same name but do different things
const cors = require('cors');

// import handlers
const { auth } = require('./handlers/actions');

// used for cross platform errors after deploying
app.use(cors());

// Routes
app.get('/authentication', auth);

exports.api = functions.https.onRequest(app);

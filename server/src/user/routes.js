// import packages
const express = require('express');
const admin = require("firebase-admin");
const serviceAccount = require("../../musictaste-8ca96-firebase-adminsdk-tnkge-cf9e068aa9.json");

// Initializing database access
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://musictaste-8ca96.firebaseio.com"
});
const db = admin.firestore();

// allows proxy+ to work
const routes = express.Router({
  mergeParams: true
});

/** ROUTES **/
routes.get('/', (req, res) => {
  res.status(200).json({});
});

routes.get('/all', (req, res) => {
  var users = [];
  db.collection("Users").get().then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.data());
      users.push(doc.data());
    })
    res.send(users).status(200);
  });
});

module.exports = {
  routes,
};
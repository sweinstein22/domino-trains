const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);

function getGameState() {
  const  ref = firebaseApp.database().ref('gameState');
  return ref.once('value').then(snap => snap.val());
}


app.get('/server', (request,response) => {
  response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  getGameState().then(gameState =>
    response.render('index', { gameState })
  ).catch(e => console.log('Functions Error:', e));
});

exports.gameState = functions.https.onRequest(app);


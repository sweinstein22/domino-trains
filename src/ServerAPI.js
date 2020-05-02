import React from 'react';
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCmR4kKqsWz4NNEeaI4wfMLPgbkS8jCb_8",
  authDomain: "domino-trains.firebaseapp.com",
  databaseURL: "https://domino-trains.firebaseio.com",
  projectId: "domino-trains",
  storageBucket: "domino-trains.appspot.com",
  messagingSenderId: "195032945010",
  appId: "1:195032945010:web:86c86bf374664910760deb"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

const ServerAPI = {
  sendStateToServer: ({data}) => {
    delete data.view;
    let stateRef = db.collection('gameState').doc('state');

    let setDB = stateRef.set({data: JSON.stringify(data)});
  },

  getStateFromServer: ({setGameStateFromServer}) => {
    db.collection('gameState').get()
      .then(snapshot => snapshot.forEach(doc => setGameStateFromServer(JSON.parse(doc.data().data))))
      .catch(err => console.log('Error:', err));
  }
};

export default ServerAPI;

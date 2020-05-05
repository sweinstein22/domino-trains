import React from 'react';
const firebase = require("firebase");

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
var functions = firebase.functions();

const client = {};

const ServerAPI = {
  mergeKeys: ['playersHands', 'publicTrains'],
  complexKeys: ['playersHands', 'publicTrains', 'trains'],
  keys: ['dominosRemaining', 'playerCount', 'players', 'playersHands', 'publicTrains', 'round', 'trains'],

  initializeServerState: ({data}) => {
    Object.keys(data).forEach(key => {
      if (key !== 'view') {
        if (ServerAPI.mergeKeys.includes(key)) {
          let value = {};
          data[key].forEach((val, index) => {
            value[index.toString()] = JSON.stringify(val);
          });
          //fetch(`https://domino-trains-server.herokuapp.com/${key}`, { 
          fetch(`http://localhost:8080/${key}`, { 
            method: 'POST',
            mode: 'cors',
            body: value,
            headers: {'Content-Type': 'application/json'}
          })
          .then(response => response.json())
          .then(val => console.log(val));
        } else {
          const value = {value: data[key]}
          //fetch(`https://domino-trains-server.herokuapp.com/${key}`, { 
          fetch(`http://localhost:8080/${key}`, { 
            method: 'POST',
            mode: 'cors',
            body: value,
            headers: {'Content-Type': 'application/json'}
          })
          .then(response => response.json())
          .then(val => console.log(val));
        }
      }
    });
  },

  sendStateToServer: ({data, view}) => {
    if (view && view !== 0) {
      Object.keys(data).forEach(key => {
        if (key !== 'view') {
          const index = (view-1).toString();

          const dataAtKey = data[key];

          if (ServerAPI.mergeKeys.includes(key)) {
            const value = dataAtKey.length ? JSON.stringify(dataAtKey[view-1]) : JSON.stringify([]);
            //fetch(`https://domino-trains-server.herokuapp.com/${key}`, { 
            fetch(`http://localhost:8080/${key}`, { 
              method: 'POST',
              mode: 'cors',
              body: JSON.stringify({index: index.toString(), value}),
              headers: {'Content-Type': 'application/json'}
            })
            .then(response => response.json())
            .then(val => console.log(val));
          }
          else {
            let value;
            switch (typeof dataAtKey) {
              case 'array': value =  dataAtKey.length ? JSON.stringify(dataAtKey) : JSON.stringify([]); break;
              default: value = JSON.stringify(dataAtKey); break;
            }
            //fetch(`https://domino-trains-server.herokuapp.com/${key}`, { 
            fetch(`http://localhost:8080/${key}`, { 
              method: 'POST',
              mode: 'cors',
              body: value,
              headers: {'Content-Type': 'application/json'}
            }).then(val => console.log(val.json()));
          }
        }
      });
    }
  },

  getStateFromServer: async ({setGameStateFromServer, currentState}) => {
    let newState = currentState;

    ServerAPI.keys.forEach(key => {
      //fetch(`https://domino-trains-server.herokuapp.com/${key}`, { 
      fetch(`http://localhost:8080/${key}`, { 
        method: 'GET',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}
      })
      .then(response => response.json())
      .then(value => {
        if (!ServerAPI.complexKeys.includes(key)) {
          const dataFromServer = value.value ? value.value : value;
          key === 'playerCount' || key === 'round'
            ? newState[key] = parseInt(dataFromServer)
            : newState[key] = dataFromServer;
          console.log('setting simple key', key, newState[key])
        } else {
          if (!newState[key]) {
            newState[key] = [];
          }
          if (key === 'publicTrains') {
console.log('publicTrains', value);
            Object.values(value).forEach(val => {
              newState[key] = newState[key].concat(val);
            })
          } else {
console.log('setting complex state', key, value);
            Object.values(value).forEach((val, index) => {
              newState[key][index] = value
            })
          }
        }
      });
    });

    return setGameStateFromServer(newState);
  }
};

export default ServerAPI;

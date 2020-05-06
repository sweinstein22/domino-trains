import store from './ReduxStore';

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

const ServerAPI = {
  mergeKeys: ['playersHands', 'publicTrains'],
  complexKeys: ['playersHands', 'publicTrains', 'trains'],
  keys: ['dominosRemaining', 'playerCount', 'players', 'playersHands', 'publicTrains', 'round', 'trains'],

  initServerState: () => {
    const state = store.getState();
    Object.keys(state).forEach(key => {
      if (!['view', 'dominos'].includes(key)) {
        if (ServerAPI.complexKeys.includes(key)) {
          let value = {};
          state[key].forEach((val, index) => {
            value[index.toString()] = JSON.stringify(val);
          });
          //fetch(`https://domino-trains-server.herokuapp.com/${key}`, {
          fetch(`http://localhost:8080/${key}`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(value),
            headers: {'Content-Type': 'application/json'}
          })
            .then(response => response.json())
            .then(val => console.log(val));
        } else {
          const value = {value: state[key]};
          //fetch(`https://domino-trains-server.herokuapp.com/${key}`, {
          fetch(`http://localhost:8080/${key}`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(value),
            headers: {'Content-Type': 'application/json'}
          })
            .then(response => response.json())
            .then(val => console.log(val));
        }
      }
    });
  },

  stateToServer: () => {
    const state = store.getState();
    const {view} = state;

    if (view && view !== 0) {
      Object.keys(state).forEach(key => {
        if (!['view', 'dominos'].includes(key)) {
          const index = (view - 1).toString();

          const stateAtKey = state[key];

          if (ServerAPI.mergeKeys.includes(key)) {
            const value = stateAtKey.length ? JSON.stringify(stateAtKey[view - 1]) : JSON.stringify([]);
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
            switch (typeof stateAtKey) {
              case 'array':
                value = stateAtKey.length ? stateAtKey : [];
                break;
              default:
                value = stateAtKey;
                break;
            }
            //fetch(`https://domino-trains-server.herokuapp.com/${key}`, {
            fetch(`http://localhost:8080/${key}`, {
              method: 'POST',
              mode: 'cors',
              body: JSON.stringify(value),
              headers: {'Content-Type': 'application/json'}
            }).then(val => console.log(val.json()));
          }
        }
      });
    }
  },

  pollServerState: () => {
    let state = store.getState();

    return ServerAPI.keys.forEach(key => {
      // fetch(`https://domino-trains-server.herokuapp.com/${key}`, {
      fetch(`http://localhost:8080/${key}`, {
        method: 'GET',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'}
      })
        .then(response => response.json())
        .then(value => {
          if (!ServerAPI.complexKeys.includes(key)) {
            const dataFromServer = value.value ? value.value : value;
            store.dispatch({
              type: 'SET', path: [key], value: dataFromServer
            });
          } else {
            if (key === 'publicTrains') {
              const publicTrains = Object.keys(value).filter(ind => value[ind]);
              store.dispatch({type: 'SET', path: [key], value: publicTrains});
            } else {
              Object.values(value).forEach((val, index) => {
                state[key][index] = value
              });
              store.dispatch({type: 'SET', path: [key], value: state[key]});
            }
          }
        });
    });
  },
};

export default ServerAPI;

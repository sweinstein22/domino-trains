import store from './ReduxStore';

const firebase = require("firebase/app");

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
  complexKeyEncodings: ['playerState'],
  simpleKeyEncodings: ['currentTurnPlayer', 'dominosRemaining', 'gameStateMessage', 'playerCount', 'players', 'round', 'scores', 'trains'],

  postToServer: async ({key, value, includeIndex}) => {
    let returnVal = null;
    const method = includeIndex ? 'PUT' : 'POST';
    await fetch(`https://domino-trains-server.herokuapp.com/${key}`, {
      method,
      mode: 'cors',
      body: value,
      headers: {'Content-Type': 'application/json'}
    })
      .catch(e => console.log('Error setting ', key, ':', e));
    return returnVal;
  },

  getFromServer: async ({key}) => {
    let returnVal = null;
    store.dispatch({type: 'SET', path: ['fetchInProgress'], value: true});
    await fetch(`https://domino-trains-server.herokuapp.com/${key}`, {
      method: 'GET',
      mode: 'cors',
      headers: {'Content-Type': 'application/json'}
    })
      .then(response => response.json())
      .then(value => {
        returnVal = value;
        store.dispatch({type: 'SET', path: ['fetchInProgress'], value: false});
      })
      .catch(e => console.log('Error getting ', key, ':', e));
    return returnVal;
  },

  initServerState: async () => {
    ServerAPI.postToServer({key: 'playerState', value: await ServerAPI.stringifyPlayerState({sendAll: true})});
    ServerAPI.simpleKeyEncodings.map(async key => ServerAPI.postToServer({key, value: await ServerAPI.stringifySimpleEndpoints({key})}));
  },

  resetServerState: async () => {
    ServerAPI.postToServer({key: 'reset', value: JSON.stringify({})});
    ServerAPI.initServerState();
  },

  stateToServer: async () => {
    const {view, playerCount} = store.getState();
    if (playerCount === null) return;

    if (view && view !== 0) {
      ServerAPI.postToServer({key: 'playerState', value: await ServerAPI.stringifyPlayerState({sendAll: false})});
    }
    if (store.currentTurnPlayerIndex() === parseInt(view)-1) {
      ServerAPI.simpleKeyEncodings.map(async key => ServerAPI.postToServer({key, value: await ServerAPI.stringifySimpleEndpoints({key})}));
    }
  },

  pollServerState: async () => {
    const {playerCount, fetchInProgress} = store.getState();
    if (fetchInProgress) return;

    if (playerCount) {
      ServerAPI.parsePlayerState({value: await ServerAPI.getFromServer({key: 'playerState'})});
    }
    ServerAPI.simpleKeyEncodings.map(async key => ServerAPI.parseSimpleEndpoints({key, value: await ServerAPI.getFromServer({key})}));
  },

  parsePlayerState: ({value}) => {
    try {
      let {playersHands, publicTrains, trainColors} = store.getState();
      Object.keys(value).forEach(index => {
        playersHands[index] = JSON.parse(value[index].hand);
        publicTrains[index] = value[index].isPublic;
        trainColors[index] = value[index].trainColor;
      });
      store.dispatch({type: 'SET', path: ['playersHands'], value: playersHands});
      store.dispatch({type: 'SET', path: ['publicTrains'], value: publicTrains});
      store.dispatch({type: 'SET', path: ['trainColors'], value: trainColors});
    } catch (e) {
      console.log(e);
    }
  },

  stringifyPlayerState: ({sendAll}) => {
    const {playersHands, publicTrains, trainColors, view} = store.getState();
    if (!playersHands.length) return;

    let value = {};
    if (sendAll) {
      playersHands.forEach((hand, index) => {
        value[index] = {index, hand: JSON.stringify(hand), isPublic: publicTrains[index], trainColor: trainColors[index]};
      });
      return JSON.stringify({value});
    } else {
      if (view && view !== 0) {
        const index = parseInt(view)-1;
        value[index] = {index, hand: JSON.stringify(playersHands[index]), isPublic: publicTrains[index], trainColor: trainColors[index]};
        return JSON.stringify({value});
      }
    }
  },

  parseSimpleEndpoints: ({key, value}) => {
    try {
      let dataFromServer = typeof value === 'object' && Object.keys(value).includes('value') ? value.value : value;
      store.dispatch({
        type: 'SET', path: [key], value: dataFromServer
      });
    } catch (e) {
      console.log(key, e)
    }
  },

  stringifySimpleEndpoints: ({key}) => {
    const stateAtKey = store.getState()[key];
    return JSON.stringify({value: stateAtKey});
  },
};

export default ServerAPI;

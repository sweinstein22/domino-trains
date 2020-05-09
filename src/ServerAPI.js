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
    ServerAPI.simpleKeyEncodings.map(async key => ServerAPI.postToServer({key, value: await ServerAPI.stringifySimpleEndpoints({key})}));
    ServerAPI.postToServer({key: 'playerState', value: await ServerAPI.stringifyPlayerState({sendAll: true})});
  },

  resetServerState: async () => {
    ServerAPI.postToServer({key: 'reset', value: JSON.stringify({})});
    ServerAPI.initServerState();
  },

  stateToServer: async () => {
    const {view, playerCount} = store.getState();
    if (playerCount === null) return;
    if (store.currentTurnPlayerIndex() === parseInt(view)-1) {
      ServerAPI.simpleKeyEncodings.map(async key => ServerAPI.postToServer({key, value: await ServerAPI.stringifySimpleEndpoints({key})}));
    }
    if (view && view !== 0) {
      ServerAPI.postToServer({key: 'playerState', value: await ServerAPI.stringifyPlayerState({sendAll: false})});
    }
  },

  pollServerState: async () => {
    const {playerCount, fetchInProgress} = store.getState();
    if (fetchInProgress) return;

    ServerAPI.simpleKeyEncodings.map(async key => ServerAPI.parseSimpleEndpoints({key, value: await ServerAPI.getFromServer({key})}));
    if (playerCount) {
      ServerAPI.parsePlayerState({value: await ServerAPI.getFromServer({key: 'playerState'})});
    }
  },

  parsePlayerState: ({value}) => {
    let {playersHands, publicTrains} = store.getState();
    Object.keys(value).forEach(index => {
      playersHands[index] = JSON.parse(value[index].hand);
      publicTrains[index] = value[index].isPublic;
    });
    store.dispatch({type: 'SET', path: ['playersHands'], value: playersHands});
    store.dispatch({type: 'SET', path: ['publicTrains'], value: publicTrains});
  },

  stringifyPlayerState: ({sendAll}) => {
    const {playersHands, publicTrains, view} = store.getState();
    if (!playersHands.length) return;

    let value = {};
    if (sendAll) {
      playersHands.forEach((hand, index) => {
        value[index] = {index, hand: JSON.stringify(hand), isPublic: publicTrains[index]};
      });
      return JSON.stringify({value});
    } else {
      if (view && view !== 0) {
        const index = parseInt(view)-1;
        value[index] = {index, hand: JSON.stringify(playersHands[index]), isPublic: publicTrains[index]};
        return JSON.stringify({value});
      }
    }
  },

  parseSimpleEndpoints: ({key, value}) => {
    let dataFromServer = typeof value === 'object' && Object.keys(value).includes('value') ? value.value : value;
    store.dispatch({
      type: 'SET', path: [key], value: dataFromServer
    });
  },

  stringifySimpleEndpoints: ({key}) => {
    const stateAtKey = store.getState()[key];
    let value;
    if (!stateAtKey) {
      value = key === 'playerCount' ? {value: stateAtKey} : [];
    }
    switch (typeof stateAtKey) {
      case 'array':
        value = stateAtKey.length ? stateAtKey : [];
        break;
      default:
        value = {value: stateAtKey};
        break;
    }
    return JSON.stringify(value);
  },
};

export default ServerAPI;

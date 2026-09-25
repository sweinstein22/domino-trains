import store from './ReduxStore';

const firebase = require("firebase/app");
require("firebase/database");

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

  postToServer: async ({key, value}) => {
    const db = firebase.database();
    try {
      if (key === 'reset') {
        await db.ref('playerCount').set({value: null});
        await db.ref('round').set({value: 12});
        await db.ref('playerState').remove();
        return null;
      }
      if (value == null) return null;
      const body = typeof value === 'string' ? JSON.parse(value) : value;
      if (key === 'playerState') {
        if (!(body && body.value)) return null;
        await db.ref('playerState').update(body.value);
        return null;
      }
      await db.ref(key).set(body);
    } catch (e) {
      console.log('Error setting ', key, ':', e);
    }
    return null;
  },

  getFromServer: async ({key}) => {
    let returnVal = null;
    store.dispatch({type: 'SET', path: ['fetchInProgress'], value: true});
    try {
      const snapshot = await firebase.database().ref(key).once('value');
      returnVal = snapshot.val();
      if (returnVal == null) returnVal = '';
    } catch (e) {
      console.log('Error getting ', key, ':', e);
    }
    store.dispatch({type: 'SET', path: ['fetchInProgress'], value: false});
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

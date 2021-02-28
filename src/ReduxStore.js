import {createStore} from 'redux';
import _ from 'lodash';
import ServerAPI from "./ServerAPI";
import TrainActions from './TrainActions';

const reducerFunc = (state = initialState, action) => {
  switch (action.type) {
    case 'SET':
      let newState = _.cloneDeep(state);
      newState[action.path] = action.value;
      return newState;
    case 'RESET':
      return {...initialState};
    default:
      return {...state};
  }
};

const getCountDependentInitialState = ({playerCount}) => {
  const eightPlayerDominos = [
    [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12],
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12],
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11], [1, 12],
    [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [2, 10], [2, 11], [2, 12],
    [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11], [3, 12],
    [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [4, 12],
    [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11], [5, 12],
    [6, 7], [6, 8], [6, 9], [6, 10], [6, 11], [6, 12],
    [7, 8], [7, 9], [7, 10], [7, 11], [7, 12],
    [8, 9], [8, 10], [8, 11], [8, 12],
    [9, 10], [9, 11], [9, 12],
    [10, 11], [10, 12],
    [11, 12]
  ];
  const twelvePlayerDominos = [
    [0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15],
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14], [0, 15],
    [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [1, 11], [1, 12], [1, 13], [1, 14], [1, 15],
    [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [2, 10], [2, 11], [2, 12], [2, 13], [2, 14], [2, 15],
    [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11], [3, 12], [3, 13], [3, 14], [3, 15],
    [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [4, 12], [4, 13], [4, 14], [4, 15],
    [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11], [5, 12], [5, 13], [5, 14], [5, 15],
    [6, 7], [6, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [6, 15],
    [7, 8], [7, 9], [7, 10], [7, 11], [7, 12], [7, 13], [7, 14], [7, 15],
    [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14], [8, 15],
    [9, 10], [9, 11], [9, 12], [9, 13], [9, 14], [9, 15],
    [10, 11], [10, 12], [10, 13], [10, 14], [10, 15],
    [11, 12], [11, 13], [11, 14], [11, 15],
    [12, 13], [12, 14], [12, 15],
    [13, 14], [13, 15],
    [14, 15]
  ];

  return playerCount < 9 ? {dominos: eightPlayerDominos, round: 12} : {dominos: twelvePlayerDominos, round: 15};
};

const initialState = {
  dominos: [],
  currentTurnPlayer: '',
  dominosRemaining: [],
  fetchInProgress: false,
  gameStateMessage: '',
  playerCount: null,
  playersHands: [],
  publicTrains: [],
  players: [],
  round: null,
  scores: [],
  showGameOptions: false,
  showScores: false,
  showSettings: false,
  trainColors: [],
  trains: [],
  view: 0,
};

export class ReduxStore {
  constructor(createStoreFunc = createStore) {
    this.store = createStoreFunc(reducerFunc, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  };

  resetStore() {
    this.store.dispatch({type: 'RESET'});
    return this.store.getState();
  };

  getStore() {
    return this.store;
  };

  getState() {
    return this.store.getState();
  };

  dispatch(action) {
    this.store.dispatch(action);
  };

  generateStartingHands() {
    let {playerCount, trainColors, round: storeRound} = this.getState();
    const {dominos, round: startingRound} = getCountDependentInitialState({playerCount});
    const round = storeRound ? storeRound : startingRound;

    this.store.dispatch({type: 'SET', path: ['dominos'], value: dominos});
    this.store.dispatch({type: 'SET', path: ['round'], value: round});

    let tilesPerHand;
    if (playerCount < 4) {
      tilesPerHand = 15;
    } else if (playerCount < 7) {
      tilesPerHand = 12;
    } else if (playerCount < 9) {
      tilesPerHand = 10;
    } else {
      tilesPerHand = 11;
    }

    let dominosRemaining = Array.from(dominos);
    dominosRemaining.splice(round, 1);

    let publicTrains = Array.from({length: parseInt(playerCount)+1}).fill(false);
    publicTrains[playerCount] = true;
    this.dispatch({type: 'SET', path: ['publicTrains'], value: publicTrains});

    const trains = Array.from({length: parseInt(playerCount)+1}).fill([[0, round]]);
    this.dispatch({type: 'SET', path: ['trains'], value: trains});

    if (!trainColors.length) {
      trainColors = Array.from({length: parseInt(playerCount)});
      const colorOptions = TrainActions.getTrainColorOptions();
      trainColors.forEach((_, index) => {
        trainColors[index] = colorOptions[index];
      });
    }

    let playersHands = Array.from({length: playerCount}).fill([]);
    for (let i = 0; i < tilesPerHand; i++) {
      for (let j = 0; j < playerCount; j++) {
        const selectedIndex = Math.floor(Math.random() * Math.floor(dominosRemaining.length));
        playersHands[j] = [...playersHands[j], dominosRemaining[selectedIndex]];
        dominosRemaining.splice(selectedIndex, 1);
      }
    }
    this.dispatch({type: 'SET', path: ['playersHands'], value: playersHands});
    this.dispatch({type: 'SET', path: ['dominosRemaining'], value: dominosRemaining});
    this.dispatch({type: 'SET', path: ['trainColors'], value: trainColors});

    ServerAPI.initServerState();
  };

  currentTurnPlayerIndex() {
    const {currentTurnPlayer, players} = this.store.getState();
    if (!players.length) return 0;
    return players.indexOf(currentTurnPlayer);
  };
}

export default new ReduxStore();

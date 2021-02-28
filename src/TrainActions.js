import store from './ReduxStore';
import ServerAPI from "./ServerAPI";

const TrainActions = {
  disableTrain: (train) => {
    const trainLastTile = train[train.length-1];
    if (trainLastTile[0] !== trainLastTile[1]) return false;

    const {dominosRemaining, playersHands} = store.getState();
    const neededTileValue = trainLastTile[1];
    let valueFound = false;
    dominosRemaining.forEach(domino => {
      if (domino[0] === neededTileValue || domino[1] === neededTileValue) valueFound = true;
    });
    if (valueFound) return false;
    playersHands.forEach(hand => hand.forEach(domino => {
      if (!domino) return;
      if (domino[0] === neededTileValue || domino[1] === neededTileValue) valueFound = true;
    }));
    return !valueFound;
  },

  flipTrainState: () => {
    const {publicTrains, view} = store.getState();
    const handIndex = parseInt(view)-1;
    publicTrains[handIndex] = !publicTrains[handIndex];

    store.dispatch({type: 'SET', path: ['publicTrains'], value: publicTrains});
    ServerAPI.stateToServer();
  },

  findHangingDoubleTrainIndex: () => {
    const {trains} = store.getState();

    let hangingDoubleTrainIndex = -1;
    trains.forEach((train, index) => {
      const lastTile = train[train.length - 1];
      if (train.length > 1 && lastTile[0] === lastTile[1]) {
        hangingDoubleTrainIndex = index
      }
    });
    return hangingDoubleTrainIndex;
  },

  getTrainColorOptions: () => ['red', 'coral', 'orange', 'yellow', 'lime-green', 'green', 'teal', 'blue', 'blue-violet', 'indigo', 'violet', 'magenta'],

  setTrainColor: (color) => {
    let {trainColors, view} = store.getState();
    trainColors[view-1] = color;
    store.dispatch({type: 'SET', path: ['trainColors'], value: trainColors});
    ServerAPI.stateToServer();
  }
};

export default TrainActions;

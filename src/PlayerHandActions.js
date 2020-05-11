import store from './ReduxStore';
import ServerAPI from "./ServerAPI";
import ServerActions from "./ServerActions";
import TrainActions from "./TrainActions";

const PlayerHandActions = {
  drawTile: () => {
    let {dominosRemaining, playersHands: newPlayersHands, view} = store.getState();
    const handIndex = parseInt(view)-1;
    const selectedIndex = Math.floor(Math.random() * Math.floor(dominosRemaining.length));
    const selectedDomino = dominosRemaining[selectedIndex];
    newPlayersHands[handIndex] = newPlayersHands[handIndex].concat([selectedDomino]);

    dominosRemaining.splice(selectedIndex, 1);
    store.dispatch({type: 'SET', path: ['dominosRemaining'], value: dominosRemaining});

    store.dispatch({type: 'SET', path: ['playersHands'], value: newPlayersHands});
    ServerAPI.stateToServer();
  },

  flipTile: ({tileIndex, newValue}) => {
    let {playersHands: newPlayersHands, view} = store.getState();
    const handIndex = parseInt(view)-1;
    newPlayersHands[handIndex][tileIndex] = newValue;

    store.dispatch({type: 'SET', path: ['playersHands'], value: newPlayersHands});
    ServerAPI.stateToServer();
  },

  checkForWin: () => {
    let {dominosRemaining, playersHands, round, scores, players, trains} = store.getState();
    playersHands.forEach((hand, index) => {
      if (!hand.length) {
        const hangingDoubleTrainIndex = TrainActions.findHangingDoubleTrainIndex();
        if (hangingDoubleTrainIndex === -1 || TrainActions.disableTrain(trains[hangingDoubleTrainIndex]) || !dominosRemaining.length) {
          if (round === 0) {
            const minScore = Math.min(...scores);
            const indexOfWinner = scores.indexOf(minScore);

            store.dispatch({type: 'SET', path: ['gameStateMessage'], value: `🎉 ${players[indexOfWinner]} wins!! 🎉`});
          } else {
            store.dispatch({type: 'SET', path: ['gameStateMessage'], value: `🎉 ${players[index]} won round ${round}! 🎉`});
          }
        }
      }
    });
  },

  calculateScores: () => {
    let {playersHands, scores} = store.getState();
    playersHands.forEach((hand, index) => {
      let sum = 0;
      hand.forEach(domino => sum = sum + parseInt(domino[0]) + parseInt(domino[1]));
      scores[index] = parseInt(scores[index]) + sum;
    });

    store.dispatch({type: 'SET', path: ['scores'], value: scores});

    PlayerHandActions.checkForWin();
    ServerAPI.stateToServer();
  },

  startNextRound: () => {
    const {round, playersHands} = store.getState();
    if (!playersHands.filter(hand => !hand.length).length) PlayerHandActions.calculateScores();
    let nextRound = round === 0 ? 12 : parseInt(round)-1;
    store.dispatch({type: 'SET', path: ['gameStateMessage'], value: ''});
    store.dispatch({type: 'SET', path: ['round'], value: nextRound});
    ServerAPI.stateToServer();

    ServerActions.endTurn();
    store.generateStartingHands();
  }
};

export default PlayerHandActions;

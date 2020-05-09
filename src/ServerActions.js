import store from './ReduxStore';
import ServerAPI from "./ServerAPI";

const ServerActions = {
  endTurn: async () => {
    let {players} = store.getState();
    let nextPlayerIndex = store.currentTurnPlayerIndex()+1;
    if (nextPlayerIndex === players.length) {
      nextPlayerIndex = 0;
    }
    const nextPlayer = players[nextPlayerIndex];

    store.dispatch({type: 'SET', path: ['currentTurnPlayer'], value: nextPlayer});
    ServerAPI.simpleKeyEncodings.map(async key => ServerAPI.postToServer({key, value: await ServerAPI.stringifySimpleEndpoints({key})}));
    ServerAPI.postToServer({key: 'playerState', value: await ServerAPI.stringifyPlayerState({sendAll: false})});
  },
};

export default ServerActions;

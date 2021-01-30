import React from 'react';
import './Board.css';
import {connect} from 'react-redux';
import Confetti from 'react-confetti'
import Dialog from "./Dialog";
import PlayerHand from "./PlayerHand";
import JoinGameForm from "./JoinGameForm";
import Toggle from "./Toggle";
import Trains from "./Trains";
import ServerAPI from "./ServerAPI";
import PlayerHandActions from "./PlayerHandActions";

class Board extends React.Component {
  constructor(props) {
    super(props);
    ServerAPI.pollServerState();
  };

  componentDidMount() {
    PlayerHandActions.checkForWin();
    this.interval = setInterval(() => ServerAPI.pollServerState(), 5000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  };

  render() {
    const {currentTurnPlayer, gameStateMessage, password, playerCount, players, round} = this.props;
    let content;
    if (!playerCount || !password) {
      content = (
        <JoinGameForm {...{password, playerCount, players}}/>
      )
    } else if (players) {
      content = (
        <span className="content">
          <Trains />
          <hr/>
          <PlayerHand/>
        </span>
      )
    } else {
      content = <span/>
    }
    return (
      <span>
        {gameStateMessage && <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
        />}
            <Dialog/>
        {!!playerCount && !!password && <span>
          <Toggle />
          <div className="round">Round: {round}, {currentTurnPlayer}'s Turn</div>
          {gameStateMessage && <div>{gameStateMessage}</div>}
        </span>}
        <div className="board">
          {content}
        </div>
      </span>
    );
  }
}

const mapStateToProps = (
  {currentTurnPlayer, gameStateMessage, dominosRemaining, password, playerCount,
    players, publicTrains, round, trains
  }) => (
  {
    currentTurnPlayer, gameStateMessage, dominosRemaining, password, playerCount,
    players, publicTrains, round, trains
  }
);

export default connect(mapStateToProps)(Board);

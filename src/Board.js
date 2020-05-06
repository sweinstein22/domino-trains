import React from 'react';
import './Board.css';
import {connect} from 'react-redux';
import PlayerHand from "./PlayerHand";
import JoinGameForm from "./JoinGameForm";
import Toggle from "./Toggle";
import Trains from "./Trains";
import ServerAPI from "./ServerAPI";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCount: null
    };
    ServerAPI.pollServerState();
  }

  componentDidMount() {
    ServerAPI.pollServerState();
    this.interval = setInterval(() => ServerAPI.pollServerState(), 5000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {playerCount, players, round} = this.props;
    let content;
    if (playerCount === null || playerCount === undefined) {
      content = (
        <JoinGameForm/>
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
        {!!playerCount && <span>
          <Toggle />
          <div className="round">Round: {round}</div>
        </span>}
        <div className="board">
          {content}
        </div>
      </span>
    );
  }
}

const mapStateToProps = ({dominosRemaining, playerCount, players, publicTrains, round, trains}) => (
  {dominosRemaining, playerCount, players, publicTrains, round, trains}
);

export default connect(mapStateToProps)(Board);
// export default Board;

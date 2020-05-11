import React from 'react';
import './Board.css';
import {connect} from 'react-redux';
import Confetti from 'react-confetti'
import { Dialog, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import store from './ReduxStore';
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

  closeScoresDialog = () => {
    store.dispatch({type: 'SET', path: ['showScores'], value: false});
  };

  render() {
    const {currentTurnPlayer, gameStateMessage, password, playerCount, players, playersHands, round, scores, showScores} = this.props;
    let content;
    if (!playerCount || !password) {
      content = (
        <JoinGameForm {...{password, playerCount}}/>
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
        <Dialog {...{
          open: showScores,
          onEscapeKeyDown: this.closeScoresDialog,
          onBackdropClick: this.closeScoresDialog
        }}>
          <Table className="score-table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Score</TableCell>
                <TableCell className="current-round">Current Round Tile Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((name, index) =>
                (<TableRow key={index}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{scores[index]}</TableCell>
                  <TableCell className="current-round">{playersHands[index] && playersHands[index].length}</TableCell>
                </TableRow>)
              )}
            </TableBody>
          </Table>
          <br/>
          <Button {...{onClick: PlayerHandActions.startNextRound}}>Start Next Round</Button>
        </Dialog>
        {!!playerCount && <span>
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
    players, playersHands, publicTrains, round, scores, showScores, trains
  }) => (
  {
    currentTurnPlayer, gameStateMessage, dominosRemaining, password, playerCount,
    players, playersHands, publicTrains, round, scores, showScores, trains
  }
);

export default connect(mapStateToProps)(Board);

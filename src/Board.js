import React from 'react';
import './Board.css';
import {connect} from 'react-redux';
import { Dialog, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import store from './ReduxStore';
import PlayerHand from "./PlayerHand";
import JoinGameForm from "./JoinGameForm";
import Toggle from "./Toggle";
import Trains from "./Trains";
import ServerAPI from "./ServerAPI";

class Board extends React.Component {
  constructor(props) {
    super(props);
    ServerAPI.pollServerState();
  };

  componentDidMount() {
    this.interval = setInterval(() => ServerAPI.pollServerState(), 5000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  };

  closeScoresDialog = () => {
    store.dispatch({type: 'SET', path: ['showScores'], value: false});
  };

  render() {
    const {currentTurnPlayer,gameStateMessage, playerCount, players, round, scores, showScores} = this.props;
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
        <Dialog {...{
          open: showScores,
          onClose: this.closeScoresDialog,
          onEscapeKeyDown: this.closeScoresDialog,
          onBackdropClick: this.closeScoresDialog
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((name, index) =>
                (<TableRow key={index}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{scores[index]}
                </TableCell></TableRow>)
              )}
            </TableBody>
          </Table>
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
  {currentTurnPlayer, gameStateMessage, dominosRemaining, playerCount,
    players, publicTrains, round, scores, showScores, trains
  }) => (
  {
    currentTurnPlayer, gameStateMessage, dominosRemaining, playerCount,
    players, publicTrains, round, scores, showScores, trains
  }
);

export default connect(mapStateToProps)(Board);

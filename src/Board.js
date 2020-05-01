import React from 'react';
import './Board.css';
import PlayerHand from "./PlayerHand";
import JoinGameForm from "./JoinGameForm";
import Toggle from "./Toggle";
import Trains from "./Trains";

export class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dominos: [
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
      ],
      dominosRemaining: [],
      playerCount: null,
      players: [],
      playersHands: [],
      round: 12,
      trains: [],
      view: 0
    }
  }

  setPlayers = ({count, players}) => {
    if (count > 1 && count < 9) {
      this.setState({
        playerCount: count,
        players,
        trains: Array.from({length: parseInt(count)+1}).fill([])
      });
      this.generateStartingHands({count});
    }
  };

  generateStartingHands = ({count}) => {
    let tilesPerHand;
    if (count < 4) {
      tilesPerHand = 8;
    } else if (count < 7) {
      tilesPerHand = 12;
    } else {
      tilesPerHand = 10;
    }

    let {dominos: dominosRemaining} = this.state;
    dominosRemaining.splice(12, 1);

    let playersHands = Array.from({length: count}).fill([]);
    for (let i = 0; i < tilesPerHand; i++) {
      for (let j = 0; j < count; j++) {
        const selectedIndex = Math.floor(Math.random() * Math.floor(dominosRemaining.length));
        playersHands[j] = [...playersHands[j], dominosRemaining[selectedIndex]];
        dominosRemaining.splice(selectedIndex, 1);
      }
    }
    this.setState({playersHands, dominosRemaining})
  };

  selectTile() {
    let {dominosRemaining} = this.state;
    const selectedIndex = Math.floor(Math.random() * Math.floor(dominosRemaining.length));
    const selectedDomino = dominosRemaining[selectedIndex];

    dominosRemaining.splice(selectedIndex, 1);
    this.setState({dominosRemaining});

    return selectedDomino;
  };

  flipTile = ({handIndex, tileIndex, newValue}) => {
    let {playersHands: newPlayersHands} = this.state;
    newPlayersHands[handIndex][tileIndex] = newValue;
    this.setState({playersHands: newPlayersHands})
  };

  drawTile = ({handIndex}) => {
    let {playersHands: newPlayersHands} = this.state;
    const selectedDomino = this.selectTile();
    newPlayersHands[handIndex] = newPlayersHands[handIndex].concat([selectedDomino]);

    this.setState({playersHands: newPlayersHands})
  };

  render() {
    const {playerCount, view, players, playersHands, round, trains} = this.state;
    let content;
    if (playerCount === null) {
      content = (
        <JoinGameForm {...{
          setPlayers: this.setPlayers
        }}/>
      )
    } else {
      content = (
        <span>
          <div className="round">Round: {round}</div>
          <Trains {...{trains, players}} />
          <hr/>
          <PlayerHand {...{
            view,
            hand: playersHands[view-1],
            flipTile: this.flipTile,
            drawTile: this.drawTile
          }} />
        </span>
      )
    }
    return (
      <div className="app">
        {!!playerCount && <Toggle {...{
          view,
          playerCount,
          players,
          currentView: view,
          setView: ({view}) => this.setState({view})
        }} />}
        <div className="board">
          {content}
        </div>
      </div>
    );
  }
};

export default Board;

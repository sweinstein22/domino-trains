import React from 'react';
import './PlayerHand.css';
import {connect} from "react-redux";
import { Button } from '@material-ui/core';
import Domino from "./Domino";
import SubmitForm from "./SubmitForm";
import store from "./ReduxStore";
import ServerAPI from "./ServerAPI";
import PlayerHandActions from "./PlayerHandActions";
import ServerActions from "./ServerActions";

class PlayerHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTiles: [],
      startingDragIndex: null,
      stoppingDragIndex: null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.view !== this.props.view || prevProps.round !== this.props.round) {
      this.setState({selectedTiles: []});
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.selectTile);
    document.addEventListener('dragenter', this.setDragIndices);
    document.addEventListener('dragover', this.setDragIndices);
    document.addEventListener('dragleave', this.setDragIndices);
    document.addEventListener('dragend', this._onDragEnd);
    document.addEventListener('drop', this._onDrop);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.selectTile);
    document.removeEventListener('dragenter', this.setDragIndices);
    document.removeEventListener('dragover', this.setDragIndices);
    document.removeEventListener('dragleave', this.setDragIndices);
    document.removeEventListener('dragend', this._onDragEnd);
    document.removeEventListener('drop', this._onDrop);
  }

  setDragIndices = (e) => {
    e.preventDefault();
    const {className, id} = e.target;
    if (!className || typeof className === "object") return;
    if (className.includes('dot')
      || className.includes('selectable')
      || className.includes('right')
      || className.includes('left')
    ) {
      const {startingDragIndex} = this.state;
      startingDragIndex === null
        ? this.setState({startingDragIndex: id})
        : this.setState({stoppingDragIndex: id});
    }
  };

  _onDrop = (e) => {
    e.preventDefault();
    let {hand, handIndex, playersHands} = this.props;
    const {startingDragIndex, stoppingDragIndex} = this.state;
    const tileToMove = hand.splice(startingDragIndex, 1);
    hand.splice(stoppingDragIndex, 0, ...tileToMove);
    playersHands[handIndex] = hand;
    store.dispatch({type: 'SET', path: ['playersHands'], value: playersHands});
    ServerAPI.stateToServer();
  };

  _onDragEnd = (e) => {
    e.preventDefault();
    this.setState({startingDragIndex: null, stoppingDragIndex: null});
  };

  selectTile = (e) => {
    const {className, id} = e.target;
    if (!className || typeof className === "object") return;
    if (className.includes('dot')
      || className.includes('selectable')
      || className.includes('right')
      || className.includes('left')
    ) {
      const {hand} = this.props;
      const {selectedTiles} = this.state;
      const domino = hand[id];
      if (!selectedTiles.some(selected => selected[0] === domino[0] && selected[1] === domino[1])) {
        this.setState({
          selectedTiles: selectedTiles.concat([domino])
        });
      } else {
        selectedTiles.splice(selectedTiles.findIndex(selected => selected[0] === domino[0] && selected[1] === domino[1]), 1);
        this.setState({selectedTiles});
      }
    }
  };

  addToTrain = (trainIndex) => {
    if (!trainIndex && trainIndex !== 0) return;

    const {selectedTiles} = this.state;
    const {hand, handIndex, trains, players, playersHands, round} = this.props;
    const newHand = hand.filter(domino => !selectedTiles.some(selected => selected[0] === domino[0] && selected[1] === domino[1]));

    trains[trainIndex] = trains[trainIndex].concat(selectedTiles);
    playersHands[handIndex] = newHand;

    this.setState({selectedTiles: []});
    store.dispatch({type: 'SET', path: ['trains'], value: trains});
    store.dispatch({type: 'SET', path: ['playersHands'], value: playersHands});

    if (!newHand.length) {
      store.dispatch({type: 'SET', path: ['gameStateMessage'], value: `${players[handIndex]} won round ${round}!`});
      PlayerHandActions.calculateScores();
    } else {
      store.dispatch({type: 'SET', path: ['gameStateMessage'], value: ''});
      ServerAPI.stateToServer();
    }
  };

  render() {
    const {hand, handIndex, publicTrains} = this.props;
    const {selectedTiles} = this.state;
    const trainIsPublic = publicTrains[handIndex];
    const isPlayersTurn = store.currentTurnPlayerIndex() === handIndex;
    if (handIndex === -1) {
      return <div className="welcome">Welcome!</div>
    } else if (!hand) {
      return <div className="loading-page">Loading...</div>
    }

    const dominos = hand && hand.map((domino, index) => {
      const tileIsSelected = selectedTiles.some(selected => selected[0] === domino[0] && selected[1] === domino[1]);
      return (
        <span {...{draggable: true, className: "draggable", key: index}}>
        <Domino {...{
          value: domino,
          flipTile: PlayerHandActions.flipTile,
          tileIndex: index,
          selectedIndex: tileIsSelected ? selectedTiles.findIndex(selected => selected[0] === domino[0] && selected[1] === domino[1]) + 1 : null,
          className: tileIsSelected ? 'selected-domino' : ''
        }} />
      </span>
      )
    });

    return (
      <div className="player-hand">
        <div className="hand">
          {isPlayersTurn && <span className="player-actions">
          <span>
            <Button {...{variant: 'outlined', size: 'small', onClick: () => PlayerHandActions.drawTile()}}>Draw Tile</Button>
            <Button {...{variant: 'outlined', size: 'small', onClick: () => PlayerHandActions.flipTrainState()}}>Make Train {trainIsPublic ? 'Private' : 'Public'}</Button>
            <Button {...{variant: 'outlined', size: 'small', onClick: () => ServerActions.endTurn()}}>End Turn</Button>
          </span>
            <SubmitForm {...{addToTrain: this.addToTrain}} />
        </span>}
          <span className="domino-section">
        {dominos}
        </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({dominosRemaining, view, playersHands, publicTrains, players, round, trains}) => {
  const index = parseInt(view) - 1;
  return {
    dominosRemaining,
    hand: index !== -1 ? playersHands[index] : [],
    handIndex: index,
    playersHands,
    publicTrains,
    players,
    round,
    trains,
  }
};

export default connect(mapStateToProps)(PlayerHand);

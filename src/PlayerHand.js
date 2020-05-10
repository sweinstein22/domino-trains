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
import TrainActions from "./TrainActions";
import Welcome from "./Welcome";

class PlayerHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTiles: [],
      startingDragIndex: null,
      stoppingDragIndex: null,
      errorMessage: ''
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

  flipTile = ({tileIndex, newValue}) => {
    const {selectedTiles} = this.state;
    const originalTile = [newValue[1], newValue[0]];
    let selectedTileIndex = -1;
    if (selectedTiles.length && selectedTiles.some((selected, index) => {
      if(selected[0] === originalTile[0] && selected[1] === originalTile[1]) {
        selectedTileIndex = index;
        return true;
      }
      return false;
    })) {
      selectedTiles[selectedTileIndex] = newValue;
      this.setState({selectedTiles});
    }

    PlayerHandActions.flipTile({tileIndex, newValue})
  };

  endTurn = () => {
    this.setState({errorMessage: ''});
    ServerActions.endTurn()
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
      if (!selectedTiles.length || !selectedTiles.some(selected => selected[0] === domino[0] && selected[1] === domino[1])) {
        this.setState({
          selectedTiles: selectedTiles.concat([domino])
        });
      } else {
        selectedTiles.splice(selectedTiles.findIndex(selected => selected[0] === domino[0] && selected[1] === domino[1]), 1);
        this.setState({selectedTiles});
      }
    }
  };

  clearSelectedTiles = () => {
    this.setState({selectedTiles: []});
  };

  validateTrainAddition = (trainIndex) => {
    const {trains} = this.props;
    const {selectedTiles} = this.state;
    const desiredTrain = trains[trainIndex];
    const currentFinalTrainValue = desiredTrain[desiredTrain.length-1][1];
    let isValid = true;

    selectedTiles.forEach((tile, index) => {
      if (index === 0) {
        if (currentFinalTrainValue !== tile[0]) isValid = false;
      } else {
        if (tile[0] !== selectedTiles[index-1][1]) isValid = false;
      }
    });

    if (!isValid) {
      this.setState({errorMessage: 'Error: invalid selection. Check that connected values match and try again.'})
    }

    return isValid;
  };

  addToTrain = (trainIndex) => {
    if (!trainIndex && trainIndex !== 0) return;
    if (!this.validateTrainAddition(trainIndex)) return;

    const {selectedTiles} = this.state;
    const {hand, handIndex, trains, players, playersHands, round} = this.props;
    const newHand = hand.filter(domino => !selectedTiles.some(selected => selected[0] === domino[0] && selected[1] === domino[1]));

    trains[trainIndex] = trains[trainIndex].concat(selectedTiles);
    playersHands[handIndex] = newHand;

    this.setState({selectedTiles: [], errorMessage: ''});
    store.dispatch({type: 'SET', path: ['trains'], value: trains});
    store.dispatch({type: 'SET', path: ['playersHands'], value: playersHands});

    if (!newHand.length) {
      const hangingDoubleTrainIndex = TrainActions.findHangingDoubleTrainIndex();
      if (hangingDoubleTrainIndex === -1) {
        store.dispatch({type: 'SET', path: ['gameStateMessage'], value: `${players[handIndex]} won round ${round}!`});
        PlayerHandActions.calculateScores();
      } else {
        PlayerHandActions.drawTile();
      }
    } else {
      store.dispatch({type: 'SET', path: ['gameStateMessage'], value: ''});
      ServerAPI.stateToServer();
    }
  };

  render() {
    const {hand, handIndex, publicTrains, dominosRemaining} = this.props;
    const {selectedTiles, errorMessage} = this.state;
    const trainIsPublic = publicTrains[handIndex];
    const isPlayersTurn = store.currentTurnPlayerIndex() === handIndex;
    if (handIndex === -1) {
      return <Welcome/>
    } else if (!hand) {
      return <div className="loading-page">Loading...</div>
    }

    const dominos = hand && hand.map((domino, index) => {
      const tileIsSelected = selectedTiles.some(selected => selected[0] === domino[0] && selected[1] === domino[1]);
      return (
        <span {...{draggable: true, className: "draggable", key: index}}>
        <Domino {...{
          value: domino,
          flipTile: this.flipTile,
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
            <Button {...{disabled: !dominosRemaining.length, variant: 'outlined', size: 'small', onClick: () => PlayerHandActions.drawTile()}}>Draw Tile</Button>
            <Button {...{variant: 'outlined', size: 'small', onClick: () => TrainActions.flipTrainState()}}>Make Train {trainIsPublic ? 'Private' : 'Public'}</Button>
            <br/>
            <Button {...{variant: 'outlined', size: 'small', onClick: this.clearSelectedTiles}}>Clear Selected Tiles</Button>
            <Button {...{variant: 'outlined', size: 'small', onClick: this.endTurn}}>End Turn</Button>
          </span>
            <SubmitForm {...{addToTrain: this.addToTrain}} />
        </span>}
          <span className="error-message">{errorMessage}</span>
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

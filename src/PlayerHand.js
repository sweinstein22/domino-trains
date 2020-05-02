import React from 'react';
import './PlayerHand.css';
import Domino from "./Domino";
import SubmitForm from "./SubmitForm";

export class PlayerHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTiles: [],
      startingDragIndex: null,
      stoppingDragIndex: null
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.view !== this.props.view) {
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
    let {hand} = this.props;
    const {startingDragIndex, stoppingDragIndex} = this.state;
    const tileToMove = hand.splice(startingDragIndex, 1);
    hand.splice(stoppingDragIndex, 0, ...tileToMove);
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
    const {addToTrain, hand, view} = this.props;
    const {selectedTiles} = this.state;
    const newHand = hand.filter(domino => !selectedTiles.some(selected => selected[0] === domino[0] && selected[1] === domino[1]));
    this.setState({selectedTiles: []});

    addToTrain({newHand, handIndex: view-1, trainIndex, trainTiles: selectedTiles});
  };

  render() {
    const {view, hand, flipTile, drawTile, players, publicTrains, flipTrainState} = this.props;
    const {selectedTiles} = this.state;
    const handIndex = view-1;
    const trainIsPublic = publicTrains.some(index => index === handIndex);
    if (view === 0) {
      return <div className="welcome">Welcome!</div>
    }

    const dominos = hand && hand.map((domino, index) => {
      const tileIsSelected = selectedTiles.some(selected => selected[0] === domino[0] && selected[1] === domino[1]);
      return (
      <span {...{draggable: true, className: "draggable", key: index}}>
        <Domino {...{
          value: domino,
          flipTile,
          handIndex,
          tileIndex: index,
          selectedIndex: tileIsSelected ? selectedTiles.findIndex(selected => selected[0] === domino[0] && selected[1] === domino[1])+1 : null,
          className: tileIsSelected ? 'selected-domino' : ''
        }} />
      </span>
    )});

    return (
      <div className="player-hand">
        <div className="hand">
        <span className="player-actions">
          <span>
            <button {...{onClick: () => drawTile({handIndex})}}>Draw Tile</button>
            <button {...{onClick: () => flipTrainState(handIndex)}}>Make Train {trainIsPublic ? 'Public' : 'Private'}</button>
          </span>
            <SubmitForm {...{addToTrain: this.addToTrain, players, publicTrains, handIndex}} />
        </span>
          <span className="domino-section">
        {dominos}
        </span>
        </div>
      </div>
    );
  }
}

export default PlayerHand;

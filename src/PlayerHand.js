import React from 'react';
import './PlayerHand.css';
import Domino from "./Domino";

export class PlayerHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: this.props.view,
      startingDragIndex: null,
      stoppingDragIndex: null
    }
  }

  setDragIndices = (e) => {
    e.preventDefault();
    if (e.target.className === 'domino') {
      const {startingDragIndex} = this.state;
      startingDragIndex === null
      ? this.setState({startingDragIndex: e.target.id})
      : this.setState({stoppingDragIndex: e.target.id});
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

  componentDidMount() {
    document.addEventListener('dragenter', this.setDragIndices);
    document.addEventListener('dragover', this.setDragIndices);
    document.addEventListener('dragleave', this.setDragIndices);
    document.addEventListener('dragend', this._onDragEnd);
    document.addEventListener('drop', this._onDrop);
  }

  componentWillUnmount() {
    document.removeEventListener('dragenter', this.setDragIndices);
    document.removeEventListener('dragover', this.setDragIndices);
    document.removeEventListener('dragleave', this.setDragIndices);
    document.removeEventListener('dragend', this._onDragEnd);
    document.removeEventListener('drop', this._onDrop);
  }

  render() {
    const {view, hand, flipTile, drawTile} = this.props;
    if (view === 0) {
      return <div className="player-hand">Welcome!</div>
    }

    const dominos = hand && hand.map((domino, index) =>
      <span {...{draggable: true, className: "domino-draggable", key: index}}>
        <Domino {...{value: domino, flipTile, handIndex: view-1, tileIndex: index}} />
      </span>
    );
    return (
      <div className="player-hand">
        <span>
          <button {...{onClick: () => drawTile({handIndex: view-1})}}>Draw Tile</button>
        </span>
        <span className="domino-section">
        {dominos}
        </span>
      </div>
    );
  }
}

export default PlayerHand;

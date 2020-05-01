import React from 'react';
import './Trains.css';
import Domino from "./Domino";

export class Trains extends React.Component {
  displayTrain = (train, index) => {
    const {players} = this.props;
    return (<div {...{key: index, className: 'train-row'}}>
      {index === players.length ? `Mexican Train: ` : `${players[index]}:`}
      {train.map((domino, key) => <Domino {...{key: `${index}-${key}`, value: domino}}/>)}
      <br/>
      </div>)
  };

  render() {
    const {trains} = this.props;
    return (
      <div className="trains">
        {trains.map((train, index) => this.displayTrain(train, index))}
      </div>
    );
  };
}

export default Trains;

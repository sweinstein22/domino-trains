import React from 'react';
import classnames from 'classnames';
import TrainIcon from '@material-ui/icons/Train';
import './Trains.css';
import Domino from "./Domino";

export class Trains extends React.Component {
  displayTrain = (train, index) => {
    const {players, publicTrains, view} = this.props;
    const playerIndex = view-1;
    const isPublic = playerIndex === index || publicTrains.includes(index) || index === players.length;
    return (<div {...{key: index, className: 'train-row'}}>
      <span {...{className: classnames("train-name", {'public-train': isPublic})}}>
        <TrainIcon/>
        {index === players.length ? ` Mexican Train: ` : ` ${players[index]}:`}
      </span>
      <span className="train-contents">
        {train.map((domino, key) =>
          <Domino {...{key: `${index}-${key}`, value: domino, className: classnames('train-domino')}}/>
        )}
      </span>
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

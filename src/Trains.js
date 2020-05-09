import React from 'react';
import classnames from 'classnames';
import TrainIcon from '@material-ui/icons/Train';
import {connect} from "react-redux";
import './Trains.css';
import Domino from "./Domino";

class Trains extends React.Component {
  displayTrain = (train, index) => {
    const {players, publicTrains, playerIndex} = this.props;
    const isPublic = playerIndex === index || publicTrains[index] || index === players.length;
    return (<div {...{key: index, className: 'train-row'}}>
      <span {...{className: classnames("train-name", {'public-train': isPublic})}}>
        <TrainIcon/>
        {index === players.length ? ` Mexican Train: ` : ` ${players[index]}:`}
      </span>
      <span className="train-contents">
        {Object.values(train).map((domino, key) =>
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

const mapStateToProps = ({players, publicTrains, trains, view}) => ({
  players, publicTrains, trains, playerIndex: parseInt(view)-1
});

export default connect(mapStateToProps)(Trains);

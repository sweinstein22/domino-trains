import React from 'react';
import classnames from 'classnames';
import TrainIcon from '@material-ui/icons/Train';
import {connect} from "react-redux";
import './Trains.css';
import Domino from "./Domino";
import TrainActions from "./TrainActions";

class Trains extends React.Component {
  componentDidUpdate() {
      const trainRows = document.querySelectorAll('.train-contents');
      trainRows.forEach(row => {
        row.scrollTo({
          left: row.scrollWidth,
          behavior: "smooth"
        });
      });
  };

  displayTrain = (train, index, disableTrain) => {
    const {players, publicTrains, playerIndex} = this.props;
    const isPublic = playerIndex === index || publicTrains[index] || index === players.length;
    return (<div {...{key: index, className: classnames('train-row', {'disabled': disableTrain})}}>
      <span {...{className: classnames("train-name", {'public-train': isPublic})}}>
        <TrainIcon/>
        {index === players.length ? ` Communal Train: ` : ` ${players[index]}'s Train:`}
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
        {trains.map((train, index) => this.displayTrain(train, index, TrainActions.disableTrain(train)))}
      </div>
    );
  };
}

const mapStateToProps = ({dominosRemaining, players, playersHands, publicTrains, trains, view}) => ({
  dominosRemaining, players, playersHands, publicTrains, trains, playerIndex: parseInt(view)-1
});

export default connect(mapStateToProps)(Trains);

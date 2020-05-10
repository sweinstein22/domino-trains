import React from 'react';
import './SubmitForm.css';
import {connect} from "react-redux";
import {Button, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core';
import TrainActions from "./TrainActions";

export class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  };

  generateOptions = () => {
    const {value} = this.state;
    const {players, publicTrains, handIndex, trains} = this.props;
    let disableTrain = false;
    const hangingDoubleTrainIndex = TrainActions.findHangingDoubleTrainIndex();

    trains.forEach(train => {
      if (TrainActions.disableTrain(train)) disableTrain = true;
    });

    if (hangingDoubleTrainIndex !== -1 && !disableTrain) {
      return (
        <Select {...{id: "train-select", onChange: this.onChange, value}}>
          <MenuItem {...{value: ''}}>Select a Train</MenuItem>
          <MenuItem {...{value: hangingDoubleTrainIndex}}>
            {hangingDoubleTrainIndex === trains.length - 1 ? `Communal Train` : `${players[hangingDoubleTrainIndex]}'s Train`}
          </MenuItem>
        </Select>
      );
    }

    return (
      <Select {...{id: "train-select", onChange: this.onChange, value}}>
        <MenuItem {...{value: ''}}>Select a Train</MenuItem>
        <MenuItem {...{value: handIndex}}>Your Train</MenuItem>
        {publicTrains.map((val, index) => {
          const name = players[index];
          if (index === handIndex || !val || index === players.length) return null;
          return (<MenuItem {...{key: index, value: index}}>{name}'s Train</MenuItem>)
        })}
        <MenuItem {...{value: players.length}}>Communal Train</MenuItem>
      </Select>
    )
  };

  onChange = (e) => {
    this.setState({value: e.target.value})
  };

  submit = (e) => {
    e.preventDefault();
    const {addToTrain} = this.props;
    const {value} = this.state;
    this.setState({value: ''});
    addToTrain(value)
  };

  render() {
    const {value} = this.state;
    return (
      <div className="submit-form">
        <FormControl>
          <InputLabel htmlFor="train-select">Train to add to: </InputLabel>
          {this.generateOptions()}
          <Button {...{variant: 'outlined', size: 'small', onClick: this.submit, disabled: value === ''}}>
            Submit
          </Button>
        </FormControl>
      </div>
    );
  }
}

export const mapStateToProps = ({players, publicTrains, trains, view}) => ({
  players, publicTrains, handIndex: parseInt(view) - 1, trains
});

export default connect(mapStateToProps)(SubmitForm);

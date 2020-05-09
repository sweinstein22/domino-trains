import React from 'react';
import './SubmitForm.css';
import {connect} from "react-redux";
import { Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

export class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
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
    const {players, publicTrains, handIndex} = this.props;
    const {value} = this.state;
    return (
      <div className="submit-form">
        <FormControl>
          <InputLabel htmlFor="train-select">Train to add to: </InputLabel>
          <Select {...{id: "train-select", onChange: this.onChange, value}}>
            <MenuItem {...{value: ''}}>Select a Train</MenuItem>
            <MenuItem {...{value: handIndex}}>Your Train</MenuItem>
            {publicTrains.map((val, index) => {
              const name = players[index];
              if (index === handIndex || !val || index === players.length) return null;
              return (<MenuItem {...{key: index, value: index}}>{name}</MenuItem>)
            })}
            <MenuItem {...{value: players.length}}>Mexican Train</MenuItem>
          </Select>
          <Button {...{variant: 'outlined', size: 'small', onClick: this.submit, disabled: value === ''}}>
            Submit
          </Button>
        </FormControl>
      </div>
    );
  }
}

export const mapStateToProps = ({players, publicTrains, view}) => ({
  players, publicTrains, handIndex: parseInt(view)-1
});

export default connect(mapStateToProps)(SubmitForm);

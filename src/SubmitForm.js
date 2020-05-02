import React from 'react';

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
        <form>
          <label htmlFor="train-select">Train to add to: </label>
          <select {...{id: "train-select", onChange: this.onChange, value}}>
            <option {...{value: ''}}>Select a Train</option>
            <option {...{value: handIndex}}>Your Train</option>
            {publicTrains.map((index) => {
              const name = players[index];
              if (index === handIndex) return null;
              return (<option {...{key: index, value: index}}>{name}</option>)
            })}
            <option {...{value: players.length}}>Mexican Train</option>
          </select>
          <button {...{onClick: this.submit, disabled: value === ''}}>Submit</button>
        </form>
      </div>
    );
  }
}

export default SubmitForm;

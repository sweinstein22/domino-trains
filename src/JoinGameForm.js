import React from 'react';
import './JoinGameForm.css';
import store from './ReduxStore';

class JoinGameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      players: [],
      countWarning: ''
    }
  };

  setCount = (event) => {
    event.preventDefault();
    const count = event.target.value;
    count < 2 || count > 8
      ? this.setState({countWarning: 'Must be between 2 and 8'})
      : this.setState({countWarning: ''});
    let players = [];
    players.length = count;
    this.setState({count, players: Array.from({length: count}).fill('')});
  };

  setPlayerNames = (event, index) => {
    event.preventDefault();
    let {players} = this.state;
    players[index] = event.target.value;
    this.setState({players});
  };

  submitForm = async () => {
    const {count, players} = this.state;
    if (count > 1 && count < 9) {
      await store.dispatch({type: 'SET', path: ['playerCount'], value: parseInt(count)});
      await store.dispatch({type: 'SET', path: ['players'], value: players});
      store.generateStartingHands();
    }
  };

  render() {
    const {count, players, countWarning} = this.state;

    return (
      <form className="game-form">
        <span>
          <label htmlFor="player-count">Number of Players (Max 8): </label>
          <input type="text" id="player-count" value={count} onChange={(event) => this.setCount(event)}/>
          <br/>
          {countWarning}
          {countWarning && <br/>}
          <br/>
        </span>
        {players.map((val, index) =>
          <span {...{key: index}}>
            <label htmlFor="player-name">Player {index + 1}: </label>
            <input type="text" id="player-name" value={players[index]} onChange={(event) => this.setPlayerNames(event, index)}/>
            <br/>
          </span>
        )}
        <br/><br/>
        <button type="button" onClick={() => this.submitForm()}>Join Game</button>
      </form>
    );
  };
}

export default JoinGameForm;

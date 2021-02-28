import React from 'react';
import './JoinGameForm.css';
import {Button, TextField} from '@material-ui/core';
import store from './ReduxStore';

class JoinGameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      formPlayers: [],
      countWarning: '',
      password: this.props.password || '',
      passwordWarning: ''
    }
  };

  setCount = (event) => {
    event.preventDefault();
    const count = event.target.value;
    count < 2 || count > 12
      ? this.setState({countWarning: 'Must be between 2 and 12'})
      : this.setState({countWarning: ''});
    let formPlayers = [];
    formPlayers.length = count;
    this.setState({count, formPlayers: Array.from({length: count}).fill('')});
  };

  setPassword = (event) => {
    event.preventDefault();
    let {passwordWarning} = this.state;
    const password = event.target.value;
    if (password !== 'choo-choo') {
      passwordWarning = 'Incorrect password'
    } else {
      passwordWarning = ''
    }
    this.setState({password, passwordWarning});
  };

  setPlayerNames = (event, index) => {
    event.preventDefault();
    let {formPlayers} = this.state;
    formPlayers[index] = event.target.value;
    this.setState({formPlayers});
  };

  submitForm = async () => {
    const {count, password, formPlayers} = this.state;
    const {playerCount} = this.props;

    if (password === 'choo-choo') {
      if (!playerCount) {
        store.dispatch({type: 'SET', path: ['playerCount'], value: parseInt(count)});
        store.dispatch({type: 'SET', path: ['players'], value: formPlayers});
        store.dispatch({type: 'SET', path: ['currentTurnPlayer'], value: formPlayers[0]});
        store.dispatch({type: 'SET', path: ['scores'], value: Array.from({length: parseInt(count)}).fill([0])});
        store.generateStartingHands();
      }
      store.dispatch({type: 'SET', path: ['password'], value: password});
    }
  };

  render() {
    const {count, formPlayers, countWarning, password, passwordWarning} = this.state;
    const {playerCount, players} = this.props;

    return (
      <div>
        <form className="game-form">
          {!playerCount && <span>
            <span>
            <TextField {...{
              label: 'Number of Players (Max 12): ', id: 'player-count', value: count,
              onChange: (event) => this.setCount(event)
            }}/>
            <br/>
              {countWarning}
              {countWarning && <br/>}
              <br/>
          </span>
            {formPlayers.map((val, index) =>
                <span {...{key: index}}>
              <TextField {...{
                label: `Player ${index + 1}: `, id: 'player-name', value: formPlayers[index],
                onChange: (event) => this.setPlayerNames(event, index)
              }}/>
              <br/>
            </span>
            )}
            <br/><br/>
          </span>}
          <TextField {...{
            label: 'Password: ', id: 'password-field', value: password,
            onChange: (event) => this.setPassword(event)
          }}/>
          <br/>
          {passwordWarning}
          {passwordWarning && <br/>}
          <br/>
          <Button {...{variant: 'outlined', size: 'small', type: 'button', onClick: () => this.submitForm()}}>
            {playerCount ? 'Join Game' : 'Start Game'}
          </Button>
        </form>
        {playerCount && <span>
          <br/>
          Currently Playing: {players.join(', ')}
          <br/><br/>
            If you're not one of the above players,
            there's another instance of this game <a href="https://domino-trains-2.web.app/">here</a>
        </span>}
      </div>
    );
  };
}

export default JoinGameForm;

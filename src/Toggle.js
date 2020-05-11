import React from 'react';
import classnames from 'classnames';
import { Button } from '@material-ui/core';
import './Toggle.css';
import ServerAPI from "./ServerAPI";
import {connect} from "react-redux";
import store from "./ReduxStore";

class Toggle extends React.Component {
  setView = ({view}) => {
    store.dispatch({type: 'SET', path: ['view'], value: view})
  };

  showScores = () => {
    store.dispatch({type: 'SET', path: ['showScores'], value: true})
  };

  render() {
    const {password, playerCount, players, view} = this.props;
    if (!players) return null;
    return (
      <div className="toggle">
        <span>
          {password && <Button {...{
            variant: 'outlined', size: 'small',
            onClick: async () => {
            store.resetStore();
            ServerAPI.resetServerState();
          }}}>Reset Game</Button>}
        </span>
        <span>
          <Button {...{
            variant: 'outlined', size: 'small',
            onClick: () => this.setView({view: 0}),
            className: classnames(view === 0 ? 'active' : '')
          }}>Welcome!</Button>
          {Array.from({length: playerCount}).map((_, index) =>
            <Button {...{
              variant: 'outlined', key: index, size: 'small',
              onClick: () => this.setView({view: index + 1}),
              className: classnames(view === index + 1 ? 'active' : '')
            }}>
              Player {index + 1}: {players[index]}
            </Button>
          )}
          <Button {...{variant: 'outlined', size: 'small', onClick: () => this.showScores()}}>
            View Game State
          </Button>
        </span>
      </div>
    );
  }
}

const mapStateToProps = ({password, playerCount, players, view}) => ({
  password, playerCount, players, view
});

export default connect(mapStateToProps)(Toggle);

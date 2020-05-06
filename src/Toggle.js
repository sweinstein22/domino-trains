import React from 'react';
import classnames from 'classnames';
import './Toggle.css';
import ServerAPI from "./ServerAPI";
import {connect} from "react-redux";
import store from "./ReduxStore";

class Toggle extends React.Component {
  setView = ({view}) => {
    store.dispatch({type: 'SET', path: ['view'], value: view})
  };

  render() {
    const {playerCount, players, view} = this.props;
    if (!players) return null;
    return (
      <div className="toggle">
        <span>
          <button {...{onClick: async () => {
            ServerAPI.stateToServer();
            store.resetStore();
          }}}>Reset Game</button>
        </span>
        <span>
          <button {...{
            onClick: () => this.setView({view: 0}),
            className: classnames(view === 0 ? 'active' : '')
          }}>Welcome!</button>
          {Array.from({length: playerCount}).map((_, index) =>
            <button key={index} onClick={() => this.setView({view: index + 1})}
                    className={classnames(view === index + 1 ? 'active' : '')}>
              Player {index + 1}: {players[index]}
            </button>
          )}
        </span>
      </div>
    );
  }
}

const mapStateToProps = ({playerCount, players, view}) => ({
  playerCount, players, view
});

export default connect(mapStateToProps)(Toggle);

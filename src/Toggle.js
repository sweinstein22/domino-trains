import React from 'react';
import classnames from 'classnames';
import './Toggle.css';
import ServerAPI from "./ServerAPI";

export class Toggle extends React.Component {
  render() {
    const {playerCount, players, setView, currentView, resetGameState} = this.props;
    return (
      <div className="toggle">
        <span>
          <button {...{onClick: async () => {
            ServerAPI.sendStateToServer({data: {}});
            resetGameState();
          }}}>Reset Game</button>
        </span>
        <span>
          <button {...{
            onClick: () => setView({view: 0}),
            className: classnames(currentView === 0 ? 'active' : '')
          }}>Welcome!</button>
          {Array.from({length: playerCount}).map((_, index) =>
            <button key={index} onClick={() => setView({view: index + 1})}
                    className={classnames(currentView === index + 1 ? 'active' : '')}>
              Player {index + 1}: {players[index]}
            </button>
          )}
        </span>
      </div>
    );
  }
}

export default Toggle;

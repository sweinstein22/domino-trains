import React from 'react';
import './Welcome.css';

class Welcome extends React.Component {
  render() {
    return (
      <span className="container">
      <div className="welcome">
        <br/>
        <div className="bold">Welcome!</div>
        <br/>
        <div>Select your name from the list of players above to view your hand.</div>
        <br/>
        <div>Train names highlighted in gold are available for you to play on.</div>
        <div>Use the rotate icon to flip a tile's orientation, and drag tiles to reorder them.</div>
        <br/>

        <div className="bold">Current Idiosyncrasies</div>
        <br/>
        <div>Did I hack this together in a few weeks? Absolutely. Is it still a little janky?
          <br/>You better believe it. Things of note:</div>
        <ul className="list">
          <li>This game works by sending state to a server. State is polled every five seconds,
            which means it may take some time for changes to propagate across all player screens.</li>
          <li>Sometimes because of the polling/syncing, flipping a tile or reordering tiles will
            immediately be undone. Enacting the move again should fix it.</li>
          <li>When you send tiles to a train, it also might flash and then revert. In this case,
            just waiting for the five second poll to kick in should propagate the change.</li>
          <li>Flipping selected tiles on a polling interval will end up deselecting the tile and unflipping the tile.
            Flip it again and it will be selected again.</li>
        </ul>

        <br/><br/><br/><br/>
        <div>Built with love for our wonderful moms. Happy Mother's Day, thank you for all that you do! <span role="img">❤</span>️</div>
      </div>
      </span>
    );
  }
}

export default Welcome;

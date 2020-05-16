import React from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import store from './ReduxStore';
import { Dialog, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import './Colors.css';
import './Dialog.css';
import PlayerHandActions from './PlayerHandActions';
import TrainActions from './TrainActions';

class BoardDialog extends React.Component {
  closeScoresDialog = () => {
    store.dispatch({type: 'SET', path: ['showScores'], value: false});
  };

  closeSettingsDialog = () => {
    store.dispatch({type: 'SET', path: ['showSettings'], value: false});
  };

  render() {
    const {players, playersHands, scores, showScores, showSettings, trainColors, view} = this.props;

    let content = <span/>;
    if (showScores) {
      content = (
        <Dialog {...{
          open: showScores,
          onEscapeKeyDown: this.closeScoresDialog,
          onBackdropClick: this.closeScoresDialog
        }}>
          <Table className="score-table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Score</TableCell>
                <TableCell className="current-round">Current Round Tile Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((name, index) =>
                (<TableRow key={index}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{scores[index]}</TableCell>
                  <TableCell className="current-round">{playersHands[index] && playersHands[index].length}</TableCell>
                </TableRow>)
              )}
            </TableBody>
          </Table>
          <br/>
          <Button {...{onClick: PlayerHandActions.startNextRound}}>Start Next Round</Button>
            </Dialog>
      );
    } else if (showSettings) {
      const colors = TrainActions.getTrainColorOptions();
      content = (
        <Dialog {...{
          open: showSettings,
          onEscapeKeyDown: this.closeSettingsDialog,
          onBackdropClick: this.closeSettingsDialog
        }}>
          <div className="settings">
            <div>Select your train color:</div>
            <div>
            {colors.map((color, index) =>
              <span {...{
                key: index,
                className: classnames('color-swatch', `${color}-swatch`, {'selected-color-swatch': color === trainColors[view-1]}),
                onClick: () => TrainActions.setTrainColor(color)
              }}/>
            )}
            </div>
          </div>
        </Dialog>
      );
    }

    return (content);
  }
}

const mapStateToProps = ({players, playersHands, scores, showScores, showSettings, trainColors, view}) =>
  ({players, playersHands, scores, showScores, showSettings, trainColors, view});

export default connect(mapStateToProps)(BoardDialog);

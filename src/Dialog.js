import React from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';
import store from './ReduxStore';
import { Dialog, Button, Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import './Colors.css';
import './Dialog.css';
import ServerAPI from "./ServerAPI";
import PlayerHandActions from './PlayerHandActions';
import TrainActions from './TrainActions';

class BoardDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resetNeedsConfirmation: true,
      nextRoundNeedsConfirmation: true
    };
  };

  closeScoresDialog = () => {
    store.dispatch({type: 'SET', path: ['showScores'], value: false});
  };

  closeSettingsDialog = () => {
    store.dispatch({type: 'SET', path: ['showSettings'], value: false});
  };

  closeGameOptionsDialog = () => {
    this.setState({resetNeedsConfirmation: true, nextRoundNeedsConfirmation: true})
    store.dispatch({type: 'SET', path: ['showGameOptions'], value: false});
  };

  render() {
    const {players, playersHands, scores, showGameOptions, showScores, showSettings, trainColors, view} = this.props;
    const {resetNeedsConfirmation, nextRoundNeedsConfirmation} = this.state;

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
    } else if (showGameOptions) {
      let dialogContent = <span/>;
      if (resetNeedsConfirmation && nextRoundNeedsConfirmation) {
        dialogContent = (
          <span>
            <Button {...{
              variant: 'outlined', size: 'small',
              onClick: () => this.setState({resetNeedsConfirmation: false})
            }}>Reset Game</Button>
              <Button {...{
                variant: 'outlined', size: 'small',
                onClick: () => this.setState({nextRoundNeedsConfirmation: false})
              }}>Start Next Round</Button>
            </span>
        )
      } else if (!resetNeedsConfirmation) {
        dialogContent = (
          <span>
            Reset Game
            <hr/>
            Are you sure? &nbsp;
              <Button {...{
                variant: 'outlined', size: 'small',
                onClick: async () => {
                  this.closeGameOptionsDialog();
                  store.resetStore();
                  ServerAPI.resetServerState();
                }
              }}>Yes</Button>
              <Button {...{
                variant: 'outlined', size: 'small',
                onClick: () => this.setState({resetNeedsConfirmation: true})
              }}>No</Button>
          </span>
        )
      } else if (!nextRoundNeedsConfirmation) {
        dialogContent = (
          <span>
            Start Next Round
            <hr/>
            Are you sure? &nbsp;
              <Button {...{
                variant: 'outlined', size: 'small',
                onClick: () => {
                  this.closeGameOptionsDialog();
                  PlayerHandActions.startNextRound();
                }
              }}>Yes</Button>
              <Button {...{
                variant: 'outlined', size: 'small',
                onClick: () => this.setState({nextRoundNeedsConfirmation: true})
              }}>No</Button>
          </span>
        );
      }

      content = (<Dialog {...{
        open: showGameOptions,
        onEscapeKeyDown: this.closeGameOptionsDialog,
        onBackdropClick: this.closeGameOptionsDialog
      }}>
    <div className="settings">
          <div className="danger-button-zone">
            {dialogContent}
          </div>
        </div>
      </Dialog>);
    }

    return (content);
  }
}

const mapStateToProps = ({players, playersHands, scores, showGameOptions, showScores, showSettings, trainColors, view}) =>
  ({players, playersHands, scores, showGameOptions, showScores, showSettings, trainColors, view});

export default connect(mapStateToProps)(BoardDialog);

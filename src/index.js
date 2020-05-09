import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import store from './ReduxStore';
import Board from './Board';
import * as serviceWorker from './serviceWorker';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

ReactDOM.render(
    <MuiThemeProvider theme={darkTheme}>
      <Provider {...{store: store.getStore()}}>
        <Board/>
      </Provider>
    </MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

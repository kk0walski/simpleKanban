import React from 'react';
import ReactDOM from 'react-dom';
import BoardContainer from './features/board/BoardContainer';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { HeadProvider } from 'react-head';
import * as serviceWorker from './serviceWorker';
import './App.scss';

const headTags = [];

ReactDOM.render(
  <HeadProvider headTags={headTags}>
    <Provider store={store}>
      <BoardContainer />
    </Provider>
  </HeadProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

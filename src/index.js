import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { HeadProvider } from 'react-head';
import * as serviceWorker from './serviceWorker';

const headTags = [];

ReactDOM.render(
  <React.StrictMode>
    <HeadProvider headTags={headTags}>
      <Provider store={store}>
        <App />
      </Provider>
    </HeadProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

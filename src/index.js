import React from 'react';
import { render } from 'react-dom';
import './styles/styles.scss';
import { Provider } from 'react-redux'
import { store } from './store';
import Board from './features/board/Board';
import * as serviceWorker from './serviceWorker';

render(
    <Provider store={store}>
        <Board />
    </Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

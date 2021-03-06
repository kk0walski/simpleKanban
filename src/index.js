import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Board from './Components/Board';
import './styles/styles.scss';

const store = configureStore();

render(
    <Provider store={store}>
        <Board />
    </Provider>,
    document.getElementById('root')
)
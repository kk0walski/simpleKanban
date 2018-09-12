import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Board from './Components/Board';
import initialData from './initial-data';

const store = configureStore();

store.dispatch({
    type: "SET_BOARD",
    payload: {
        board: initialData
    }
})

render(
    <Provider store={store}>
        <Board />
    </Provider>,
    document.getElementById('root')
)
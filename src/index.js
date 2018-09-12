import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Board from './Components/Board';
import initialData from './initial-data';

const store = configureStore();

const jsx = (
    <Provider store={store}>
        <Board />
    </Provider>
)

ReactDOM.render(jsx.document.getElementById('root'))
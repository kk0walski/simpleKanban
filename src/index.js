import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Board from './Components/Board';
import initialData from './initial-data';
import './styles/styles.scss';

const store = configureStore();

fetch('http://0.0.0.0:5000/api', {
    method: 'post',
    body: JSON.stringify(initialData)
}).then(response => console.log(response.json))

store.dispatch({
    type: "SET_BOARD",
    payload: {
        data: initialData
    }
})

render(
    <Provider store={store}>
        <Board />
    </Provider>,
    document.getElementById('root')
)
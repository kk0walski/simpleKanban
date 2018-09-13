import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Board from './Components/Board';
import initialData from './initial-data';
import axios from 'axios';
import './styles/styles.scss';

const store = configureStore();

axios.post('http://0.0.0.0:5000/api', { ...initialData }).then(res => {
    console.log(res);
    console.log(res.data);
})

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
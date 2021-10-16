import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Board from './Components/Board';
import './styles/styles.scss';
import reportWebVitals from './reportWebVitals';

const store = configureStore();

render(
    <Provider store={store}>
        <Board />
    </Provider>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

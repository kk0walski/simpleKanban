import { createStore } from 'redux';
import Board from '../reducers/Board';

export default () => {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(Board, composeEnhancers);
    return store
}
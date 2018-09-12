import { createStore, combineReducers, compose } from 'redux';
import Board from '../reducers/Board';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {

    const appReducer = combineReducers({
        Board
    })
    const store = createStore(appReducer, composeEnhancers);
    return store
}
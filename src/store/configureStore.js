import { createStore, combineReducers, compose } from 'redux';
import Board from '../reducers/Board';
import Cards from '../reducers/Cards';
import Lists from '../reducers/Lists';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {

    const appReducer = combineReducers({
        Board,
        Cards,
        Lists
    })
    const store = createStore(appReducer, composeEnhancers);
    return store
}
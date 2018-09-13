import { createStore, combineReducers, applyMiddleware compose } from 'redux';
import Board from '../reducers/Board';
import Cards from '../reducers/Cards';
import Lists from '../reducers/Lists';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {

    const appReducer = combineReducers({
        Board,
        Cards,
        Lists
    })
    const store = createStore(appReducer, composeEnhancers(applyMiddleware(thunk)));
    return store
}
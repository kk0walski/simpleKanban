import myApi from './api'

export const startMoveList = (action = {}) => {
    return (dispatch) => (
        myApi.endpoints.board.updateAll(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const startAddList = (action = {})  => {
    console.log(myApi)
    return (dispatch) => (
        myApi.endpoints.lists.create(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}
export const startDeleteList = (action = {})  => {
    return (dispatch) => (
        myApi.endpoints.lists.delete(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const startUpdateList = (action = {})  => {
    return (dispatch) => (
        myApi.endpoints.lists.update(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const startMoveCard = (action = {}) => {
    return (dispatch) => (
        myApi.endpoints.lists.updateAll(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const startAddCard = (action = {})  => {
    return (dispatch) => (
        myApi.endpoints.cards.create(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const startDeleteCard = (action = {})  => {
    return (dispatch) => (
        myApi.endpoints.cards.delete(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const startUpdateCard = (action = {})  => {
    return (dispatch) => (
        myApi.endpoints.cards.update(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const startGetBoard = (action ={}) => {
    return (dispatch) => (
        myApi.endpoints.board.getAll().then(res => {
            dispatch({
                type: 'SET_BOARD',
                payload: {
                    data: res.data
                }
            });
            console.log(res.data)
        })
    )
}
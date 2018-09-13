import api from './api'

const myApi = api()

export const startMoveList = (action = {}) => {
    return (dispatch) => (
        myApi.endpoints.board.updateAll(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const startAddList = (action = {})  => {
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
import api from './api'

const myApi = api()

export const startMoveList = (action) => {
    myApi.endpoints.board.updateAll(action).then(res => {
        dispatch(action)
        console.log(res.data)
    })
}

export const startAddList = (action) => {
    myApi.endpoints.lists.create(action).then(res => {
        dispatch(action)
        console.log(res.data)
    })
}
export const startDeleteList = (action) => {
    myApi.endpoints.lists.delete(action).then(res => {
        dispatch(action)
        console.log(res.data)
    })
}

export const startUpdateList = (action) => {
    myApi.endpoints.lists.update(action).then(res => {
        dispatch(action)
        console.log(res.data)
    })
}

export const startMoveCard = (action) => {
    myApi.endpoints.lists.updateAll(action).then(res => {
        dispatch(action)
        console.log(res.data)
    })
}

export const startAddCard = (action) => {
    myApi.endpoints.cards.create(action).then(res => {
        dispatch(action)
        console.log(res.data)
    })
}

export const startDeleteCard = (action) => {
    myApi.endpoints.cards.delete(action).then(res => {
        dispatch(action)
        console.log(res.data)
    })
}

export const startUpdateCard = (action) => {
    myApi.endpoints.cards.update(action).then(res => {
        dispatch(action)
        console.log(res.data)
    })
}
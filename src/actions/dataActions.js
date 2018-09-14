import myApi from './api'

export const moveList = (oldListIndex, newListIndex) => ({
    type: 'MOVE_LIST',
    payload: {
        oldListIndex,
        newListIndex
    }
})

export const startMoveList = (oldListIndex, newListIndex) => {
    const action = moveList(oldListIndex, newListIndex)
    return (dispatch) => (
        myApi.endpoints.board.updateAll(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const addList = (listId, listTitle) => ({
    type: "ADD_LIST",
    payload: {
        listId,
        title: listTitle
    }
})

export const startAddList = (listId, listTitle) => {
    const action = addList(listId, listTitle)
    return (dispatch) => (
        myApi.endpoints.lists.create(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const deleteList = (listId) => ({
    type: 'DELETE_LIST',
    payload: {
        id: listId
    }
})

export const startDeleteList = (listId) => {
    const action = deleteList(listId)
    return (dispatch) => (
        myApi.endpoints.lists.delete(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const updateList = (id, listTitle) => ({
    type: "CHANGE_LIST_NAME",
    payload: {
        id,
        title: listTitle
    }
})

export const startUpdateList = (id, listTitle) => {
    const action = updateList(id, listTitle)
    return (dispatch) => (
        myApi.endpoints.lists.update(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const moveCard = (oldCardIndex, newCardIndex, sourceListId, destListId) => ({
    type: 'MOVE_CARD',
    payload: {
        oldCardIndex,
        newCardIndex,
        sourceListId,
        destListId
    }
})

export const startMoveCard = (oldCardIndex, newCardIndex, sourceListId, destListId) => {
    const action = moveCard(oldCardIndex, newCardIndex, sourceListId, destListId)
    return (dispatch) => (
        myApi.endpoints.lists.updateAll(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const addCard = (listId, cardId, newTitle, newContent) => ({
    type: "ADD_CARD",
    payload: {
        listId,
        cardId,
        title: newTitle,
        content: newContent
    }
})

export const startAddCard = (listId, cardId, newTitle, newContent) => {
    const action = addCard(listId, cardId, newTitle, newContent)
    return (dispatch) => (
        myApi.endpoints.cards.create(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const deleteCard = (listId, cardId) => ({
    type: "DELETE_CARD",
    payload: {
        listId,
        id: cardId
    }
})

export const startDeleteCard = (listId, cardId) => {
    const action = deleteCard(listId, cardId)
    return (dispatch) => (
        myApi.endpoints.cards.delete(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const updateCard = (cardId, newTitle, newContent) => ({
    type: "CHANGE_CARD_DATA",
    payload: {
        id: cardId,
        newTitle,
        newContent
    }
})

export const startUpdateCard = (cardId, newTitle, newContent) => {
    const action  = updateCard(cardId, newTitle, newContent)
    return (dispatch) => (
        myApi.endpoints.cards.update(action).then(res => {
            dispatch(action)
            console.log(res.data)
        })
    )
}

export const startGetBoard = () => {
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
const Lists = (state = {}, action) => {
    switch (action.type) {
        case "SET_BOARD": {
            const { data } = action.payload;
            return data.lists;
        }
        case "ADD_LIST": {
            const { listId, title } = action.payload;
            return {
                ...state,
                [listId]: {
                    id: listId,
                    title,
                    cards: []
                }
            };
        }
        case "ADD_CARD": {
            const { listId, cardId } = action.payload;
            return {
                ...state,
                [listId]: {
                    ...state[listId],
                    cards: [...state[listId].cards, cardId]
                }
            }
        }
        case "CHANGE_LIST_NAME": {
            const { id, title } = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    title
                }
            }
        }
        case "MOVE_CARD": {
            const {
                oldCardIndex,
                newCardIndex,
                sourceListId,
                destListId
            } = action.payload;
            // Move within the same list
            if (sourceListId === destListId) {
                const newCards = Array.from(state[sourceListId].cards);
                const [removedCard] = newCards.splice(oldCardIndex, 1);
                newCards.splice(newCardIndex, 0, removedCard);
                return {
                    ...state,
                    [sourceListId]: {
                        ...state[sourceListId],
                        cards: newCards
                    }
                };
            }
            // Move card from one list to another
            const sourceCards = Array.from(state[sourceListId].cards);
            const [removedCard] = sourceCards.splice(oldCardIndex, 1);
            const destinationCards = Array.from(state[destListId].cards);
            destinationCards.splice(newCardIndex, 0, removedCard);
            return {
                ...state,
                [sourceListId]: {
                    ...state[sourceListId],
                    cards: sourceCards
                },
                [destListId]: {
                    ...state[destListId],
                    cards: destinationCards
                }
            };
        }
        case "DELETE_CARD": {
            const { listId, id } = action.payload;
            return {
                ...state,
                [listId]: {
                    ...state[listId],
                    cards: state[listId].cards.filter(card => card !== id)
                }
            };
        }
        case "DELETE_LIST": {
            const { id } = action.payload;
            const { [id]: deleteList, ...restOfLists } = state;
            return restOfLists;
        }
        default: {
            return state
        }
    }
}

export default Lists;
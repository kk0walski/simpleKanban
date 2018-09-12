const Board = (state = {}, action) => {
    switch (action.type) {
        case "ADD_LIST": {
            const { listId, title } = action.payload;
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: {
                        listId,
                        title,
                        cardIds: []
                    }
                },
                listOrder: [...state.listOrder, listId]
            }
        };
        case "CHANGE_LIST_NAME": {
            const { listId, listTitle} = action.payload;
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listId]: {
                        ...state.lists[listId],
                        title: listTitle
                    }
                }
            }
        };
        case "MOVE_LIST": {
            const { oldListIndex, newListIndex } = action.payload;
            const newLists = Array.from(state.listOrder);
            const [removedList] = newLists.splice(oldListIndex, 1);
            newLists.splice(newListIndex, 0, removedList);
            return {
                ...state,
                listOrder: newLists
            }
        };
        case "DELETE_LIST": {
            const { list } = action.payload;
            const { [list]: deleteList, ...restOfLists } = state.lists;
            return {
                ...state,
                cards: Object.keys(state.cards)
                    .filter(myCardId => !deleteList.cardIds.includes(myCardId))
                    .reduce(
                        (newState, cardId) => ({ ...newState, [cardId]: state[cardId] }),
                        {}
                    ),
                lists: restOfLists,
                listOrder: state.listOrder.filter(cardId => cardId !== list )
            }
        };
        case "ADD_CARD": {
            const { list, cardId, title, content } = action.payload;
            return {
                ...state,
                cards: {
                    ...state.cards,
                    [cardId]: {
                        id: cardId,
                        title,
                        content
                    }
                },
                lists: {
                    ...state.lists,
                    [list]: {
                        ...state.lists[list],
                        cardIds: [...state.lists[list].cardIds, list]
                    }
                }
            }
        };
        case "CHANGE_CARD_TITLE": {
            const { cardId, cardTitle } = action.payload;
            return {
                ...state,
                cards: {
                    ...state.cards,
                    [cardId]: {
                        ...state.cards[cardId],
                        title: cardTitle
                    }
                }
            }
        };
        case "CHANGE_CARD_CONTENT": {
            const { cardId, cardContent } = action.payload;
            return {
                ...state,
                cards: {
                    ...state.cards,
                    [cardId]: {
                        ...state.cards[cardId],
                        content: cardContent
                    }
                }
            }
        };
        case "MOVE_CARD": {
            const {
                oldCardIndex,
                newCardIndex,
                sourceListId,
                destListId
            } = action.payload;
            // Move within the same list
            if (sourceListId === destListId) {
                const newCards = Array.from(state.lists[sourceListId].cardIds);
                const [removedCard] = newCards.splice(oldCardIndex, 1);
                newCards.splice(newCardIndex, 1, removedCard);
                return {
                    ...state,
                    lists: {
                        ...state.lists,
                        [sourceListId]: {
                            ...state.lists[sourceListId],
                            cardIds: newCards
                        }
                    }
                }
            };
            // Move card from one list to another
            const sourceCards = Array.from(state[sourceListId].cardIds);
            const [removedCard] = sourceCards.splice(oldCardIndex, 1);
            const destinationCards = Array.from(state[destListId].cardIds);
            destinationCards.splice(newCardIndex, 0, removedCard);
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [sourceListId]: {
                        ...state.lists[sourceListId],
                        cardIds: sourceCards
                    },
                    [destListId]: {
                        ...state.lists[destListId],
                        cardIds: destinationCards
                    }
                }
            };
        };
        case "DELETE_CARD": {
            const { list, cardId } = action.payload;
            const { [cardId]: deleteCard, ...restOfCards } = state.cards;
            return {
                ...state,
                cards: restOfCards,
                lists: {
                    ...state.lists,
                    [list]: {
                        ...state.lists[list],
                        cardIds: state.lists[list].cardIds.filter(card => card !== cardId )
                    }
                }
            }
        }
        default: {
            return state;
        }
    }
};

export default Board;
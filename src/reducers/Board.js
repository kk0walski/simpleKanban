const Board = (state = {}, action) => {
    switch (action.type) {
        case "ADD_LIST": {
            const { listId, title } = action.payload;
            return {
                ...state,
                columns: {
                    ...state.columns,
                    [listId]: {
                        listId,
                        title,
                        taskIds: []
                    }
                },
                columnOrder: [...state.columnOrder, listId]
            }
        };
        case "CHANGE_LIST_NAME": {
            const { listId, listTitle} = action.payload;
            return {
                ...state,
                columns: {
                    ...state.columns,
                    [listId]: {
                        ...state.columns[listId],
                        title: listTitle
                    }
                }
            }
        };
        case "MOVE_LIST": {
            const { oldListIndex, newListIndex } = action.payload;
            const newLists = Array.from(state.columnOrder);
            const [removedList] = newLists.splice(oldListIndex, 1);
            newLists.splice(newListIndex, 0, removedList);
            return {
                ...state,
                columnOrder: newLists
            }
        };
        case "DELETE_LIST": {
            const { list } = action.payload;
            const { [list]: deleteList, ...restOfLists } = state.columns;
            return {
                ...state,
                tasks: Object.keys(state.tasks)
                    .filter(myCardId => !deleteList.taskIds.includes(myCardId))
                    .reduce(
                        (newState, cardId) => ({ ...newState, [cardId]: state[cardId] }),
                        {}
                    ),
                columns: restOfLists,
                columnOrder: state.columnOrder.filter(cardId => cardId !== list )
            }
        };
        case "ADD_CARD": {
            const { list, cardId, title, content } = action.payload;
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [cardId]: {
                        id: cardId,
                        title,
                        content
                    }
                },
                columns: {
                    ...state.columns,
                    [list]: {
                        ...state.columns[list],
                        taskIds: [...state.columns[list].taskIds, list]
                    }
                }
            }
        };
        case "CHANGE_CARD_TITLE": {
            const { cardId, cardTitle } = action.payload;
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [cardId]: {
                        ...state.tasks[cardId],
                        title: cardTitle
                    }
                }
            }
        };
        case "CHANGE_CARD_CONTENT": {
            const { cardId, cardContent } = action.payload;
            return {
                ...state,
                tasks: {
                    ...state.tasks,
                    [cardId]: {
                        ...state.tasks[cardId],
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
                const newCards = Array.from(state.columns[sourceListId].taskIds);
                const [removedCard] = newCards.splice(oldCardIndex, 1);
                newCards.splice(newCardIndex, 1, removedCard);
                return {
                    ...state,
                    columns: {
                        ...state.columns,
                        [sourceListId]: {
                            ...state.columns[sourceListId],
                            taskIds: newCards
                        }
                    }
                }
            };
            // Move card from one list to another
            const sourceCards = Array.from(state[sourceListId].taskIds);
            const [removedCard] = sourceCards.splice(oldCardIndex, 1);
            const destinationCards = Array.from(state[destListId].taskIds);
            destinationCards.splice(newCardIndex, 0, removedCard);
            return {
                ...state,
                columns: {
                    ...state.columns,
                    [sourceListId]: {
                        ...state.columns[sourceListId],
                        taskIds: sourceCards
                    },
                    [destListId]: {
                        ...state.columns[destListId],
                        taskIds: destinationCards
                    }
                }
            };
        };
        case "DELETE_CARD": {
            const { list, cardId } = action.payload;
            const { [cardId]: deleteCard, ...restOfCards } = state.tasks;
            return {
                ...state,
                tasks: restOfCards,
                columns: {
                    ...state.columns,
                    [list]: {
                        ...state.columns[list],
                        taskIds: state.columns[list].taskIds.filter(card => card !== cardId )
                    }
                }
            }
        }
    }
};

export default Board;
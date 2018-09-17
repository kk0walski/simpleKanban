const Cards = (state = {}, action) => {
    switch (action.type) {
        case "SET_BOARD": {
            const { data } = action.payload;
            return data.cards;
        }
        case "ADD_CARD": {
            const { cardId, title, content } = action.payload;
            return {
                ...state,
                [cardId]: {
                    id: cardId,
                    title,
                    content
                }
            };
        }
        case "CHANGE_CARD_DATA": {
            const { id, newTitle, newContent} = action.payload;
            return {
                ...state,
                [id]: {
                    ...state[id],
                    title: newTitle,
                    content: newContent
                }
            }
        }
        case "DELETE_CARD": {
            const { id } = action.payload;
            const { [id]: deleteCard, ...restOfCards } = state;
            return restOfCards;
        }
        case "DELETE_LIST":
            {
                const {
                    cards: cardIds
                } = action.payload;
                return Object.keys(state)
                    .filter(cardId => !cardIds.includes(cardId))
                    .reduce((newState, cardId) => ({ ...newState,
                        [cardId]: state[cardId]
                    }), {});
            }
        default: {
            return state;
        }
    }
}

export default Cards;
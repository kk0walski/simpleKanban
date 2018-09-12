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
            const { cardId, newTitle, newContent} = action.payload;
            return {
                ...state,
                [cardId]: {
                    ...state[cardId],
                    title: newTitle,
                    content: newContent
                }
            }
        }
        case "DELETE_CARD": {
            const { cardId } = action.payload;
            const { [cardId]: deleteCard, ...restOfCards } = state;
            return restOfCards;
        }
        default: {
            return state;
        }
    }
}

export default Cards;
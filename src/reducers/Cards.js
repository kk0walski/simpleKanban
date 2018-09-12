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
        case "CHANGE_CARD_TITLE": {
            const { cardId, cardTitle } = action.payload;
            return {
                ...state,
                [cardId]: {
                    ...state[cardId],
                    title: cardTitle
                }
            };
        }
        case "CHANGE_CARD_CONTENT": {
            const { cardId, cardContent } = action.payload;
            return {
                ...state,
                [cardId]: {
                    ...state[cardId],
                    content: cardContent
                }
            };
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
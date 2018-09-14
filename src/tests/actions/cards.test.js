import { moveCard, addCard, deleteCard, updateCard } from '../../actions/dataActions'

test('should setup remove card action object', () => {
    const action = deleteCard('list-1', 'card-1')
    expect(action).toEqual({
        type: "DELETE_CARD",
        payload: {
            listId: 'list-1',
            id: 'card-1'
        }
    });
})

test('should setup add card action object', () => {
    const action = addCard('list-1', 'card-1', 'card-1', 'test-content')
    expect(action).toEqual({
        type: "ADD_CARD",
        payload: {
            listId: 'list-1',
            cardId: 'card-1',
            title: 'card-1',
            content: 'test-content'
        }
    });
})

test('should setup update card action object', () => {
    const action = updateCard('card-1', 'new-card-1', 'new-test-content')
    expect(action).toEqual({
        type: "CHANGE_CARD_DATA",
        payload: {
            id: 'card-1',
            newTitle: 'new-card-1',
            newContent: 'new-test-content'
        }
    });
})

test('should setup move card action object', () => {
    const action = moveCard(1, 2, 1, 3)
    expect(action).toEqual({
        type: 'MOVE_CARD',
        payload: {
            oldCardIndex: 1,
            newCardIndex: 2,
            sourceListId: 1,
            destListId: 3
        }
    });
})
import cardReducer from '../../reducers/Cards';

test('should setup default lists values', () => {
    const state = cardReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({})
})

test('should add card', () => {
    const currentState = {}
    const card = {
        cardId: 'card-1',
        title: 'card-1',
        content: 'card-1-content'
    }
    const newCard = {
        id: 'card-1',
        title: 'card-1',
        content: 'card-1-content'
    }
    const action = {
        type: 'ADD_CARD',
        payload: card
    }
    const newState = {'card-1': newCard}
    const state = cardReducer(currentState, action)
    expect(state).toEqual(newState)
})

test('should change data', () => {
    const currentState = {
        'card-1': {
            id: 'card-1',
            title: 'card-1',
            content: 'card-1-content'
        }
    }
    const newState = {
        'card-1': {
            id: 'card-1',
            title: 'new-card-1',
            content: 'new-card-1-content'
        }
    }
    const action = {
        type: 'CHANGE_CARD_DATA',
        payload: {
            id: 'card-1',
            newTitle: newState['card-1'].title,
            newContent: newState['card-1'].content
        }
    }
    const state = cardReducer(currentState, action)
    expect(state).toEqual(newState)
})

test('should daleta card', () => {
    const currentState = {
        'card-1': {
            id: 'card-1',
            title: 'card-1',
            content: 'card-1-content'
        }
    }
    const newState = {}
    const action = {
        type: 'DELETE_CARD',
        payload: {
            id: 'card-1'
        }
    }
    const state = cardReducer(currentState, action)
    expect(state).toEqual(newState)
})
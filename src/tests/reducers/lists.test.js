import listsReducer from '../../reducers/Lists';

test('should setup default lists values', () => {
    const state = listsReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({})
})

test('should add list', () => {
    const currentState = {}
    const list = {
        id: 'list-1',
        title: 'list-title',
        cards: []
    }
    const action = {
        type: 'ADD_LIST',
        payload: {
            listId: list.id,
            title: list.title
        }
    }
    const state = listsReducer(currentState, action)
    expect(state['list-1']).toEqual(list)
})

test('should change add card', () => {
    const currentState = {
        'list-1': {
            id: 'list-1',
            title: 'list-1',
            cards: []
        }
    }
    const newState = {
        'list-1': {
            ...currentState['list-1'],
            cards: ['card-1']
        }
    }
    const action = {
        type: 'ADD_CARD',
        payload: {
            listId: 'list-1',
            cardId: 'card-1'
        }
    }
    const state = listsReducer(currentState, action)
    expect(state, newState)
})

test('should delete list name', () => {
    const currentState = {
        'list-1': {
            id: 'list-1',
            title: 'list-1',
            cards: []
        }
    }
    const newState = {}
    const action = {
        type: 'DELETE_LIST',
        payload: {
            id: 'list-1'
        }
    }
    const state = listsReducer(currentState, action);
    expect(state, newState)
})

test('should move card', () => {
    const currentState = {
        'list-1': {
            id: 'list-1',
            title: 'list-1',
            cards: ['card-1', 'card-2']
        }
    }
    const newState = {
        'list-1': {
            ...currentState['list-1'],
            cards: ['card-2', 'card-1']
        }
    }
    const action = {
        type: 'MOVE_CARD',
        payload: {
            oldCardIndex: 0,
            newCardIndex: 1,
            sourceListId: 'list-1',
            destListId: 'list-1'
        }
    }
    const state = listsReducer(currentState, action)
    expect(state, newState)
})

test('should move card', () => {
    const currentState = {
        'list-1': {
            id: 'list-1',
            title: 'list-1',
            cards: ['card-1', 'card-2']
        },
        'list-2': {
            id: 'list-2',
            title: 'list-2',
            cards: []
        }
    }
    const newState = {
        'list-1': {
            ...currentState['list-1'],
            cards: ['card-1']
        },
        'list-2': {
            ...currentState['list-2'],
            cards: ['card-2']
        }
    }
    const action = {
        type: 'MOVE_CARD',
        payload: {
            oldCardIndex: 0,
            newCardIndex: 0,
            sourceListId: 'list-1',
            destListId: 'list-2'
        }
    }
    const state = listsReducer(currentState, action)
    expect(state, newState)
})

test('should delete card', () => {
    const currentState = {
        'list-1': {
            id: 'list-1',
            title: 'list-1',
            cards: ['card-1', 'card-2']
        }
    }
    const newState = {
        'list-1': {
            ...currentState['list-1'],
            cards: ['card-1']
        }
    }
    const action = {
        type: 'DELETE_CARD',
        payload: {
            listId: 'list-1',
            id: 'card-2'
        }
    }
    const state = listsReducer(currentState, action)
    expect(state, newState)
})
import listsReducer from '../../reducers/Lists';

test('should setup default lists values', () => {
    const state = listsReducer(undefined, { type: '@@INIT'});
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

test('should change list name', () => {
    const currentState = {
        'list-1': {
            id: 'list-1',
            title: 'list-1',
            cards: []
        }
    }
    const newState = {'list-1': {
        ...currentState['list-1'],
        cards: ['card-1']
    }}
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
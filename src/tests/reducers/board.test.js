import boardReducer from '../../reducers/Board';

test('should setup default lists values', () => {
    const state = boardReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual([])
})

test('should add list', () => {
    const currentState = []
    const action = {
        type: 'ADD_LIST',
        payload: {
            listId: 'list-1'
        }
    }
    const state = boardReducer(currentState, action)
    expect(state).toEqual(['list-1'])
})

test('should move list', () => {
    const currentState = ['list-1', 'list-2']
    const action = {
        type: 'MOVE_LIST',
        payload: {
            oldListIndex: 0,
            newListIndex: 1
        }
    }
    const state = boardReducer(currentState, action)
    expect(state).toEqual(['list-2', 'list-1'])
})

test('should move list', () => {
    const currentState = ['list-1', 'list-2']
    const action = {
        type: 'DELETE_LIST',
        payload: {
            id: 'list-1'
        }
    }
    const state = boardReducer(currentState, action)
    expect(state).toEqual(['list-2'])
})
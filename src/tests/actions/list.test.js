import { moveList, addList, deleteList, updateList } from '../../actions/dataActions'

test('should setup remove list action object', () => {
    const action = deleteList('list-1')
    expect(action).toEqual({
        type: "DELETE_LIST",
        payload: {
            id: 'list-1'
        }
    });
})

test('should setup add list action object', () => {
    const action = addList('list-1', 'list-1')
    expect(action).toEqual({
        type: "ADD_LIST",
        payload: {
            listId: 'list-1',
            title: 'list-1'
        }
    });
})

test('should setup update list action object', () => {
    const action = updateList('list-1', 'list-1')
    expect(action).toEqual({
        type: "CHANGE_LIST_NAME",
        payload: {
            id: 'list-1',
            title: 'list-1'
        }
    });
})

test('should setup move list action object', () => {
    const action = moveList(1, 2)
    expect(action).toEqual({
        type: "MOVE_LIST",
        payload: {
            oldListIndex: 1,
            newListIndex: 2
        }
    });
})
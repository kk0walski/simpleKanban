const Board = (state = [], action) => {
    switch (action.type) {
        case "SET_BOARD": {
            const { data } = action.payload;
            return data.board
        }
        case "ADD_LIST": {
            const { listId } = action.payload;
            return [...state, listId];
        }
        case "MOVE_LIST": {
            const { oldListIndex, newListIndex } = action.payload;
            const newLists = Array.from(state);
            const [removedList] = newLists.splice(oldListIndex, 1);
            newLists.splice(newListIndex, 0, removedList);
            return newLists
        }
        case "DELETE_LIST": {
            const { id } = action.payload;
            return state.filter(list => list !== id)
        }
        default: {
            return state;
        }
    }
};

export default Board;
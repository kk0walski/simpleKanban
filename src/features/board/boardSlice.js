import { nanoid } from 'nanoid'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBoard } from "./boardAPI";

export const boardAsync = createAsyncThunk(
    'board/fetchBoard',
    async (id) => {
      const response = await fetchBoard(id);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
  );

export const boardSlice = createSlice({
    name: 'board',
    initialState: {
        _id: nanoid(),
        title: "New board",
        color: "blue",
        columnOrder: [],
        columns: {},
        cards: {}
    },
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        move: (state, action) => {
            const { destination, source, draggableId, type } = action.payload;
            if (destination && (destination.droppableId !== source.droppableId || destination.index !== source.index)) {
                if (type === 'column') {
                    const newColumnOrder = Array.from(state.columnOrder);
                    newColumnOrder.splice(source.index, 1);
                    newColumnOrder.splice(destination.index, 0, draggableId);
                    state.columnOrder = newColumnOrder;
                } else {
                    const start = state.columns[source.droppableId];
                    const finish = state.columns[destination.droppableId];
                    if (start === finish) {
                        const newTaskIds = Array.from(start.taskIds);
                        newTaskIds.splice(source.index, 1);
                        newTaskIds.splice(destination.index, 0, draggableId);

                        const newColumn = {
                            ...start,
                            taskIds: newTaskIds
                        };

                        state.columns[newColumn.id] = newColumn
                    }
                    else {
                        const startTaskIds = Array.from(start.taskIds);
                        startTaskIds.splice(source.index, 1);
                        const newStart = {
                            ...start,
                            taskIds: startTaskIds,
                        };

                        const finishTaskIds = Array.from(finish.taskIds);
                        finishTaskIds.splice(destination.index, 0, draggableId);
                        const newFinish = {
                            ...finish,
                            taskIds: finishTaskIds,
                        };
                        state.columns[newStart.id] = newStart;
                        state.columns[newFinish.id] = newFinish;
                    }
                }
            }
        },
        editCard: (state, action) => {
            const { cardText, cardId } = action.payload
            state.cards[cardId].content = cardText

        },
        addCard: (state, action) => {
            const { cardText, cardId, listId } = action.payload
            state.cards[cardId] = { id: cardId, content: cardText }
            state.columns[listId].taskIds.push(cardId)
        },
        addList: (state, action) => {
            const { listTitle, listId } = action.payload;
            state.columnOrder.push(listId);
            state.columns[listId] = { id: listId, title: listTitle, taskIds: [] };
        },
        changeTitle: (state, action) => {
            const { newTitle } = action.payload;
            state.title = newTitle
        },
        changeColor: (state, action) => {
            const { color } = action.payload;
            state.color = color;
        },
        changeListTitle: (state, action) => {
            const { listTitle, listId } = action.payload;
            state.columns[listId].title = listTitle;
        },
        removeList: (state, action) => {
            const { cardIds, listId } = action.payload;
            const { [listId]: deleteList, ...restOfLists } = state.columns
            state.columns = restOfLists
            cardIds.forEach(id => {
                delete state.cards[id]
            })
            delete state.columns[listId]
            state.columnOrder = state.columnOrder.filter(item => item !== listId)
        },
        removeCard: (state, action) => {
            const { cardId, listId } = action.payload;
            state.columns[listId].taskIds = state.columns[listId].taskIds.filter(item => item !== cardId);
            const { [cardId]: deleteCard, ...restOfCards } = state.cards;
            state.cards = restOfCards;
        },
        changeCardColor: (state, action) => {
            const {cardId, color } = action.payload;
            state.cards[cardId].color = color
        }
    },
    extraReducers: (builder) => {
        builder.addCase(boardAsync.fulfilled, (state, action) => {
            state = action.payload
        })
    }

});

export const { move, editCard, addCard, addList, changeTitle, changeColor, changeListTitle, removeList, removeCard, changeCardColor } = boardSlice.actions;

export const selectBoard = (state) => state.board;

export default boardSlice.reducer;
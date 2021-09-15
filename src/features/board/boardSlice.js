import { createSlice } from '@reduxjs/toolkit';

export const boardSlice = createSlice({
    name: 'board',
    initialState: {
        tasks: {
            'task-1': { id: 'task-1', content: 'Take out the garbage' },
            'task-2': { id: 'task-2', content: 'Watch my favorite show' },
            'task-3': { id: 'task-3', content: 'Charge your phone' },
            'task-4': { id: 'task-4', content: 'Cook dinner' }
        },
        columns: {
            'column-1': {
                id: 'column-1',
                title: 'To do',
                taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
            },
            'column-2': {
                id: 'column-2',
                title: 'In progress',
                taskIds: []
            },
            'column-3': {
                id: 'column-3',
                title: 'Done',
                taskIds: []
            }
        },
        columnOrder: ['column-1', 'column-2', 'column-3'],
        color: 'blue'
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
    },

});

export const { move } = boardSlice.actions;

export const selectBoard = (state) => state.board;

export default boardSlice.reducer;
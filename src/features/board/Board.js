import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { move, selectBoard } from './boardSlice';
import Column from './Column';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
`;


class InnerList extends React.PureComponent {
    render() {
        const { column, taskMap, index } = this.props;
        const tasks = column.taskIds.map(taskId => taskMap[taskId]);
        return <Column column={column} tasks={tasks} index={index} />
    }
}

export function Board() {
    const board = useSelector(selectBoard);
    const dispatch = useDispatch();
    return (
        <DragDropContext onDragEnd={(result) => {
            console.log(result)
            dispatch(move(result))
        }}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
                {(provided) => (
                    <div>
                        <Container
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {board.columnOrder.map((columnId, index) => {
                                const column = board.columns[columnId];
                                return <InnerList key={column.id} column={column} taskMap={board.tasks} index={index} />;
                            })}
                        </Container>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
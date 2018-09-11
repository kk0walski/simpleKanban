import React, { Component } from 'react'
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { grid, colors } from './constants';
import Task from './Task';

const Container = styled.div`
    background-color: ${({ isDraggingOver }) =>
        isDraggingOver ? colors.blue.lighter : colors.blue.light};
    display: inline-flex;
    flex-direction: column;
    opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
    margin: ${grid}px;
    border: ${grid}px;
    padding-bottom: 0;
    transition: background-color 0.1s ease, opacity 0.1s ease;
    user-select: none;
    width: 250px;
    `;
const Title = styled.h3`
    padding: 8px;
`;
const TaskList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')}
    flex-grow: 1;
    min-height: 0;
`;

class InnerList extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps === this.props.tasks) {
            return false;
        }
        return true;
    }

    render() {
        return this.props.tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} />
        ));
    }
}


export default class Column extends Component {
    render() {
        return (
            <Draggable draggableId={this.props.column.id} index={this.props.index} disableInteractiveElementBlocking>
                {(provided) => (
                    <div>
                        <Container
                            {...provided.draggableProps}
                            innerRef={provided.innerRef}
                        >
                            <Title {...provided.dragHandleProps}>{this.props.column.title}</Title>
                            <Droppable droppableId={this.props.column.id} type="task">
                                {(provided, snapchot) => (
                                    <div>
                                        <TaskList
                                            innerRef={provided.innerRef}
                                            {...provided.droppableProps}
                                            isDraggingOver={snapchot.isDraggingOver}
                                        >
                                            <InnerList tasks={this.props.tasks} />
                                        </TaskList>
                                    </div>
                                )}
                            </Droppable>
                        </Container>
                        {provided.placeholder}
                    </div>
                )}
            </Draggable>
        )
    }
}

import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { connect } from "react-redux";
import { move } from './boardSlice';
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

class Board extends React.Component {
    render(){
        return (
            <DragDropContext onDragEnd={(result) => this.props.move(result)}>
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                    {(provided) => (
                        <div>
                            <Container
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {this.props.board.columnOrder.map((columnId, index) => {
                                    const column = this.props.board.columns[columnId];
                                    return <InnerList key={column.id} column={column} taskMap={this.props.board.tasks} index={index} />;
                                })}
                            </Container>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

const mapDispatchToProps = { move };

export default connect(mapStateToProps, mapDispatchToProps)(Board);
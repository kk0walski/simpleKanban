import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';
import Column from './Column';
import styled from 'styled-components';
import ListAdder from './ListAdder';

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


class Board extends Component {
    static propTypes = {
        columnOrder: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        columns: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    }

    onDragEnd = result => {
        const { destination, source, type } = result;

        if (!destination) {
            return
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        if (type === 'column') {
            dispatch({
                type: 'MOVE_LIST',
                payload: {
                    oldListIndex: source.index,
                    newListIndex: destination.index
                }
            })
            return;
        } else {
            dispatch({
                type: 'MOVE_CARD',
                payload: {
                    oldCardIndex: source.index,
                    newCardIndex: destination.index,
                    sourceListId: source.droppableId,
                    destListId: destination.droppableId
                }
            })
            return;
        }
    };

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                    {(provided) => (
                        <div>
                            <Container
                                {...provided.droppableProps}
                                innerRef={provided.innerRef}
                            >
                                {this.props.columnOrder.map((columnId, index) => {
                                    const column = this.props.columns[columnId];
                                    return <InnerList key={column.id} column={column} taskMap={this.state.tasks} index={index} />;
                                })}
                            </Container>
                            {provided.placeholder}
                            <ListAdder />
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        columnOrder: state.columnOrder,
        columns: state.columns
    }
}

export default connect(mapStateToProps)(Board);
import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './Card';
import styled from "styled-components";
import ListHeader from './ListHeader';
import CardAdder from './CardAdder';

const TaskList = styled.div`
background-color: 'inherit'
`

class InnerList extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps === this.props.cards) {
            return false;
        }
        return true;
    }

    render() {
        return (
            <div className="cards">
                {
                    this.props.cards.map((card, index) => (
                        <Card key={card.id} card={card} listId={this.props.listId} index={index} />
                    ))
                }
            </div>
        )
    }
}

const List = (props) => {
    return <Draggable draggableId={props.list.id} index={props.index} disableInteractiveElementBlocking>
        {(provided) => (
            <div className="list-wrapper">
                <div
                    className="ListContainer"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <ListHeader
                        dragHandleProps={provided.dragHandleProps}
                        listTitle={props.list.title}
                        listId={props.list.id}
                        cards={props.cards}
                    />
                    <div className="cards-wrapper">
                        <Droppable droppableId={props.list.id} type="card">
                            {(provided, snapchot) => (
                                <TaskList
                                    className="cardList"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    isDraggingOver={snapchot.isDraggingOver}
                                    style={{
                                        backgroundColor: (snapchot.isDraggingOver ? 'skyblue' : 'inherit')
                                    }}
                                >
                                    <InnerList cards={props.cards} listId={props.list.id} />
                                    {provided.placeholder}
                                </TaskList>
                            )}
                        </Droppable>
                    </div>
                    <CardAdder listId={props.list.id} />
                </div>
            </div>
        )}
    </Draggable>
}

export default List
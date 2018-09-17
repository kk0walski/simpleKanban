import React, { Component } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from "react-redux";
import CardAdder from './CardAdder';
import ListHeader from "./ListHeader";
import Card from './Card';


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


class List extends Component {
    render() {
        return (
            <Draggable draggableId={this.props.list.id} index={this.props.index} disableInteractiveElementBlocking>
                {(provided) => (
                    <div className="list-wrapper">
                        <div
                            className="ListContainer"
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                        >
                            <ListHeader
                                dragHandleProps={provided.dragHandleProps}
                                listTitle={this.props.list.title}
                                listId={this.props.list.id}
                                cards={this.props.cards}
                            />
                            <div className="cards-wrapper"> 
                                <Droppable droppableId={this.props.list.id} type="card">
                                    {(provided, snapchot) => (
                                        <div>
                                            <div>
                                                <div
                                                    className="cardList"
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    isDraggingOver={snapchot.isDraggingOver}
                                                    style={{
                                                        backgroundColor: (snapchot.isDraggingOver ? 'skyblue' : 'inherit')
                                                    }}
                                                >
                                                    <InnerList cards={this.props.cards} listId={this.props.list.id}/>
                                                    {provided.placeholder}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                            <CardAdder listId={this.props.list.id} cards={this.props.cards} />
                        </div>
                    </div>
                )}
            </Draggable>
        )
    }
}

export default connect()(List)
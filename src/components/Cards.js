import React, { Component } from 'react'
import { Droppable } from 'react-beautiful-dnd';
import Card from "./Card";


export default class Cards extends Component {
    scrollToBottom = () => {
        this.listEnd.scrollIntoView();
    };


    shouldComponentUpdate(nextProps) {
        if (nextProps === this.props.cards) {
            return false;
        }
        return true;
    }

    render() {
        const { id, cards } = this.props;
        return (
            <Droppable droppableId={id}>
                {(provided, { isDraggingOver }) => (
                    <>
                        <div className="cards" ref={provided.innerRef}>
                            {cards.map((card, index) => (
                                <Card
                                    isDraggingOver={isDraggingOver}
                                    key={card.id}
                                    card={card}
                                    index={index}
                                    listId={id}
                                />
                            ))}
                            {provided.placeholder}
                            <div
                                style={{ float: "left", clear: "both" }}
                                ref={el => {
                                    this.listEnd = el;
                                }}
                            />
                        </div>
                    </>
                )}
            </Droppable>
        );
    }
}
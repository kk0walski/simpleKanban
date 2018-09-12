import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd';

export default class Card extends Component {
    render() {
        return (
        <Draggable draggableId={this.props.card.id} index={this.props.index}>
            {(provided) => (
                <div 
                className="cardContainer"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                >
                    <div class="cardTitle">
                    {this.props.card.title}
                    </div>
                    {this.props.card.content}
                </div>
            )}
        </Draggable>
        );
    }
}

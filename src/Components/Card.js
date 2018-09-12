import React, { Component } from 'react'
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
`;

export default class Card extends Component {
    render() {
        return (
        <Draggable draggableId={this.props.card.id} index={this.props.index}>
            {(provided, snapchot) => (
                <Container 
                innerRef={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                isDragging={snapchot.isDragging}
                >
                    {this.props.card.content}
                </Container>
            )}
        </Draggable>
        );
    }
}
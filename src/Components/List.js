import React, { Component } from 'react'
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { grid, colors } from './constants';
import CardAdder from './CardAdder';
import Card from './Card';

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
const CardList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')}
    flex-grow: 1;
    min-height: 0;
`;

class InnerList extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps === this.props.cards) {
            return false;
        }
        return true;
    }

    render() {
        return this.props.cards.map((card, index) => (
            <Card key={card.id} card={card} index={index} />
        ));
    }
}


export default class List extends Component {
    render() {
        return (
            <Draggable draggableId={this.props.list.id} index={this.props.index} disableInteractiveElementBlocking>
                {(provided) => (
                    <div>
                        <Container
                            {...provided.draggableProps}
                            innerRef={provided.innerRef}
                        >
                            <Title {...provided.dragHandleProps}>{this.props.list.title}</Title>
                            <Droppable droppableId={this.props.list.id} type="card">
                                {(provided, snapchot) => (
                                    <div>
                                        <div>
                                            <CardList
                                                innerRef={provided.innerRef}
                                                {...provided.droppableProps}
                                                isDraggingOver={snapchot.isDraggingOver}
                                            >
                                                <InnerList cards={this.props.cards} />
                                                {provided.placeholder}
                                            </CardList>
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                            <CardAdder listId={this.props.list.id} cards={this.props.cards} />
                        </Container>
                    </div>
                )}
            </Draggable>
        )
    }
}

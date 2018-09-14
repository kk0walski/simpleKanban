import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import '@atlaskit/css-reset';
import List from './List';
import ListAdder from './ListAdder';
import { startMoveList, startMoveCard, startGetBoard } from '../actions/dataActions';

class InnerList extends React.PureComponent {
    render() {
        const { list, cardMap, index } = this.props;
        const cards = list.cards.map(cardId => cardMap[cardId]);
        return <List list={list} cards={cards} index={index} />
    }
}


class Board extends Component {
    static propTypes = {
        listOrder: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        lists: PropTypes.object.isRequired,
        cards: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    }

    constructor(props){
        super(props)
        props.startGetBoard()
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

        if (type === 'list') {
            this.props.startMoveList({
                type: 'MOVE_LIST',
                payload: {
                    oldListIndex: source.index,
                    newListIndex: destination.index
                }
            })
            return;
        } else {
            this.props.startMoveCard({
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
                <Droppable droppableId="all-lists" direction="horizontal" type="list">
                    {(provided) => (
                        <div>
                            <div
                                className="container"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {this.props.listOrder.map((listId, index) => {
                                    const list = this.props.lists[listId];
                                    return <InnerList key={list.id} list={list} cardMap={this.props.cards} index={index} />;
                                })}
                                {provided.placeholder}
                                <ListAdder />
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listOrder: state.Board,
        lists: state.Lists,
        cards: state.Cards
    }
}

const mapDispatchToProps = (dispatch) => ({
    startMoveList: (acttion) => dispatch(startMoveList(acttion)),
    startMoveCard: (acttion) => dispatch(startMoveCard(acttion)),
    startGetBoard: () => dispatch(startGetBoard())
  });

export default connect(mapStateToProps, mapDispatchToProps)(Board);
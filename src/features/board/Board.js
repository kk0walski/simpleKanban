import { useGetBoardQuery, useGetListsQuery, useGetCardsQuery, useMoveListMutation, useMoveCardMutation } from "../../services/board";
import List from './List';
import ListAdder from './ListAdder';
import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';


class InnerList extends React.PureComponent {
    render() {
        const { list, cardMap, index } = this.props;
        const cards = list.cards.map(cardId => cardMap[cardId]);
        return <List list={list} cards={cards} index={index} />
    }
}


const Board = () => {
    const { data: board, isLoading: boardIsLoading } = useGetBoardQuery()
    const { data: lists, isLoading: listsIsLoading } = useGetListsQuery()
    const { data: cards, isLoading: cardsIsLoading } = useGetCardsQuery()
    const [moveCard] = useMoveCardMutation()
    const [moveList] = useMoveListMutation()


    async function onDragEnd(result) {
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
            await moveList({
                type: 'MOVE_LIST',
                payload: {
                    oldListIndex: source.index,
                    newListIndex: destination.index
                }
            }).unwrap()
            return;
        } else {
            await moveCard({
                type: 'MOVE_CARD',
                payload: {
                    oldCardIndex: source.index,
                    newCardIndex: destination.index,
                    sourceListId: source.droppableId,
                    destListId: destination.droppableId
                }
            }).unwrap()
            return;
        }
    }

    if (boardIsLoading || listsIsLoading || cardsIsLoading) {
        return <div>Loading</div>
    }

    if (!board) {
        return <div>No board</div>
    }

    return <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" direction="horizontal" type="list">
            {(provided) => (
                <div>
                    <div
                        className="container"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {board.map((listId, index) => {
                            if (!lists || !lists[listId]) {
                                return <div>No lists</div>
                            }
                            else {
                                if (!cards) {
                                    return <div>No cards</div>
                                } else {
                                    const list = lists[listId];
                                    return <InnerList key={list.id} list={list} cardMap={cards} index={index} />;
                                }
                            }
                        })}
                        {provided.placeholder}
                        <ListAdder />
                    </div>
                </div>
            )}
        </Droppable>
    </DragDropContext>
}

export default Board
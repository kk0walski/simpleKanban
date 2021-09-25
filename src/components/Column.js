import React, { Component } from 'react'
import classnames from "classnames";
import { Draggable} from 'react-beautiful-dnd';
import ListHeader from "./ListHeader";
import Cards from "./Cards";
import CardAdder from './CardAdder';
import "../styles/Column.scss";


export default class Column extends Component {

    constructor() {
        super();
        this.state = {
          newText: "",
          isOpen: false
        };
      }

    render() {
        const { column, index, cards} = this.props
        return (
            <Draggable draggableId={column.id} index={index} disableInteractiveElementBlocking>
                {(provided, snapshot) => (
                    <>
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="list-wrapper"
                        >
                            <div
                                className={classnames("list", {
                                    "list--drag": snapshot.isDragging
                                })}
                            >
                                <ListHeader
                                    dragHandleProps={provided.dragHandleProps}
                                    listTitle={column.title}
                                    listId={column.id}
                                    cards={cards}
                                />
                                <div className="cards-wrapper">
                                    <Cards id={column.id} cards={cards} />
                                </div>
                            </div>
                            <CardAdder listId={column.id} />
                        </div>
                        {provided.placeholder}
                    </>
                )}
            </Draggable>
        )
    }
}
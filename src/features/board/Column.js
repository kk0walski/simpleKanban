import React, { Component } from 'react'
import classnames from "classnames";
import { Draggable} from 'react-beautiful-dnd';
import ListHeader from "./ListHeader";
import Cards from "./Cards";
import "./Column.scss";


export default class Column extends Component {
    render() {
        return (
            <Draggable draggableId={this.props.column.id} index={this.props.index} disableInteractiveElementBlocking>
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
                                    listTitle={this.props.column.title}
                                    listId={this.props.column.id}
                                    cards={this.props.cards}
                                />
                                <div className="cards-wrapper">
                                    <Cards id={this.props.column.id} cards={this.props.cards} />
                                </div>
                            </div>
                        </div>
                        {provided.placeholder}
                    </>
                )}
            </Draggable>
        )
    }
}
import React, { Component } from 'react'
import classnames from "classnames";
import { Draggable, Droppable} from 'react-beautiful-dnd';
import ListHeader from "./ListHeader";
import Card from "./Card";
import "./Column.scss";

class Cards extends Component {
    scrollToBottom = () => {
        this.listEnd.scrollIntoView();
    };

    
    shouldComponentUpdate(nextProps) {
        if (nextProps === this.props.tasks) {
            return false;
        }
        return true;
    }

    render() {
        const { id, tasks } = this.props;
        return (
            <Droppable droppableId={id}>
              {(provided, { isDraggingOver }) => (
                <>
                  <div className="cards" ref={provided.innerRef}>
                    {tasks.map((card, index) => (
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
                                    cards={this.props.tasks}
                                />
                                <div className="cards-wrapper">
                                    <Cards id={this.props.column.id} tasks={this.props.tasks} />
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
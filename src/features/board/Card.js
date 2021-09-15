import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import classnames from "classnames";
import formatMarkdown from "./formatMarkdown";
import "./Card.scss";

export default class Task extends Component {

    render() {
        return (
            <Draggable draggableId={this.props.card.id} index={this.props.index}>
            {(provided, snapshot) => (
              <>
                {/* eslint-disable */}
                <div
                  className={classnames("card-title", {
                    "card-title--drag": snapshot.isDragging
                  })}
                  ref={ref => {
                    provided.innerRef(ref);
                    this.ref = ref;
                  }}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...provided.draggableProps.style,
                  }}
                >
                  <div
                    className="card-title-html"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(this.props.card.content)
                    }}
                  />
                  {/* eslint-enable */}
                </div>
                {/* Remove placeholder when not dragging over to reduce snapping */}
                {this.props.isDraggingOver && provided.placeholder}
              </>
            )}
          </Draggable>
        );
    }
}
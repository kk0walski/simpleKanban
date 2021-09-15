import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import classnames from "classnames";
import formatMarkdown from "./formatMarkdown";
import "./Card.scss";

export default class Task extends Component {

    constructor() {
        super();
        this.state = {
          isModalOpen: false
        };
      }
    
      toggleCardEditor = () => {
        this.setState({ isModalOpen: !this.state.isModalOpen });
      };
    
      handleClick = event => {
        const { tagName, checked, id } = event.target;
        if (tagName.toLowerCase() === "input") {
          // The id is a string that describes which number in the order of checkboxes this particular checkbox has
          this.toggleCheckbox(checked, parseInt(id, 10));
        } else if (tagName.toLowerCase() !== "a") {
          this.toggleCardEditor(event);
        }
      };
    
      handleKeyDown = event => {
        // Only open card on enter since spacebar is used by react-beautiful-dnd for keyboard dragging
        if (event.keyCode === 13 && event.target.tagName.toLowerCase() !== "a") {
          event.preventDefault();
          this.toggleCardEditor();
        }
      };

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
                  onClick={event => {
                    this.handleClick(event);
                  }}
                  onKeyDown={event => {
                    this.handleKeyDown(event);
                  }}
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
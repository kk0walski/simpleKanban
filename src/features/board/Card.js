import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import { connect } from "react-redux";
import { editCard } from './boardSlice';
import classnames from "classnames";
import formatMarkdown from "./formatMarkdown";
import CardBadges from "./CardBadges";
import { findCheckboxes } from "./utils";
import CardModal from './CardModal';
import "./Card.scss";

class Card extends Component {

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

  // identify the clicked checkbox by its index and give it a new checked attribute
  toggleCheckbox = (checked, i) => {
    const { card } = this.props;

    let j = 0;
    const newText = card.content.replace(/\[(\s|x)\]/g, match => {
      let newString;
      if (i === j) {
        newString = checked ? "[x]" : "[ ]";
      } else {
        newString = match;
      }
      j += 1;
      return newString;
    });

    this.props.editCard({ cardId: card.id, cardText: newText })
  };

  render() {
    const { card, index, listId, isDraggingOver } = this.props;
    const { isModalOpen } = this.state;
    const checkboxes = findCheckboxes(card.content);
    return (
      <>
        <Draggable draggableId={card.id} index={index}>
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
                  background: card.color
                }}
              >
                <div
                  className="card-title-html"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(card.content)
                  }}
                />
                {/* eslint-enable */}
                {(checkboxes.total > 0) && <CardBadges checkboxes={checkboxes} />}
              </div>
              {/* Remove placeholder when not dragging over to reduce snapping */}
              {isDraggingOver && provided.placeholder}
            </>
          )}
        </Draggable>
        <CardModal
          isOpen={isModalOpen}
          cardElement={this.ref}
          card={card}
          listId={listId}
          toggleCardEditor={this.toggleCardEditor}
        />
      </>
    );
  }
}

const mapDispatchToProps = { editCard }

export default connect(undefined, mapDispatchToProps)(Card);
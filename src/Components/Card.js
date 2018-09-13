import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import ClickOutside from './ClickOutside';
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";

class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditingOpen: false,
            newTitle: this.props.card.title,
            newContent: this.props.card.content
        }
    }

    toggleCardEditor = () => {
        this.setState({ isEditingOpen: !this.state.isEditingOpen })
    }

    handleClick(event) {
        this.toggleCardEditor(event);
    }

    titleChange = event => {
        this.setState({ newTitle: event.target.value });
    };

    contentChange = event => {
        this.setState({ newContent: event.target.value });
    }

    handleKeyDown = event => {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();
            this.submitCard();
        }
    };

    handleDelete = () => {
        const { listId, card, dispatch } = this.props;
        dispatch({
            type: "DELETE_CARD",
            payload: {
                listId,
                cardId: card.id
            }
        })
    }

    submitCard = () => {
        const { newTitle, newContent } = this.state;
        const { card, dispatch } = this.props;
        if (newTitle === "" && newContent === "") {
            this.handleDelete();
        } else if (newTitle !== card.title || newContent !== card.content ) {
            dispatch({
                type: "CHANGE_CARD_DATA",
                payload: {
                    cardId: card.id,
                    newTitle,
                    newContent
                }
            });
        }
        this.toggleCardEditor();
    };

    render() {
        const { isEditingOpen, newTitle, newContent } = this.state;
        if (!isEditingOpen) {
            return (
                <Draggable draggableId={this.props.card.id} index={this.props.index}>
                    {(provided) => (
                        <div
                            className="cardContainer"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={event => {
                                this.handleClick(event);
                            }}
                        >
                            <div className="cardTitle">
                                {this.props.card.title}
                            </div>
                            {this.props.card.content}
                        </div>
                    )}
                </Draggable>
            )
        } else {
            return (
                <ClickOutside handleClickOutside={this.toggleCardEditor}>
                    <div className="cardContainer">
                        <form>
                            <Textarea
                                autoFocus
                                useCacheForDOMMeasurements
                                minRows={1}
                                value={newTitle}
                                onChange={this.titleChange}
                                onKeyDown={this.handleKeyDown}
                                placeholder="Title"
                            />
                            <Textarea
                                autoFocus
                                useCacheForDOMMeasurements
                                minRows={1}
                                value={newContent}
                                onChange={this.contentChange}
                                onKeyDown={this.handleKeyDown}
                                placeholder="Text"
                            />
                        </form>
                        <div className="container">
                            <button className="successButton" onClick={this.submitCard}>
                                    Submit
                            </button>
                            <button className="deleteButton" onClick={this.handleDelete}>
                                    Delete
                            </button>
                        </div>
                    </div>
                </ClickOutside>
            )
        }
    }
}

export default connect()(Card)
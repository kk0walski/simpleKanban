import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd';
import ClickOutside from './ClickOutside';
import Textarea from "react-textarea-autosize";

export default class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditingOpen: false,
            newTitle: this.props.card.title,
            newContent: this.props.card.content
        }
    }

    toggleCardComposer = () => {
        this.setState({ isEditingOpen: !this.state.isEditingOpen })
    }

    handleClick(event){
        this.toggleCardComposer(event);
    }

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
                            <div class="cardTitle">
                                {this.props.card.title}
                            </div>
                            {this.props.card.content}
                        </div>
                    )}
                </Draggable>
            )
        } else {
            return (
                <ClickOutside handleClickOutside={this.toggleCardComposer}>
                    <div className="cardContainer">
                        <form>
                            <Textarea
                                autoFocus
                                useCacheForDOMMeasurements
                                minRows={1}
                                value={newTitle}
                                placeholder="Title"
                            />
                            <Textarea
                                autoFocus
                                useCacheForDOMMeasurements
                                minRows={1}
                                value={newContent}
                                placeholder="Text"
                            />
                        </form>
                    </div>
                </ClickOutside>
            )
        }
    }
}

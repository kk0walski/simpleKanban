import { nanoid } from 'nanoid';
import React, { Component } from 'react';
import { connect } from "react-redux";
import { addCard } from '../features/board/boardSlice';
import Textarea from "react-textarea-autosize";
import ClickOutside from "./ClickOutside";
import "../styles/CardAdder.scss";

class CardAdder extends Component {

    constructor() {
        super();
        this.state = {
            newText: "",
            isOpen: false
        };
    }

    toggleCardComposer = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    handleChange = event => {
        this.setState({ newText: event.target.value });
    };

    handleKeyDown = event => {
        if (event.keyCode === 13 && event.shiftKey === false) {
            this.handleSubmit(event);
        } else if (event.keyCode === 27) {
            this.toggleCardComposer();
        }
    };

    handleSubmit = event => {
        event.preventDefault();
        const { newText } = this.state;
        const { listId } = this.props;
        if (newText === "") return;

        const cardId = nanoid();
        this.props.addCard({ cardText: newText, cardId, listId })
        this.toggleCardComposer();
        this.setState({ newText: "" });
    };

    render() {
        const { newText, isOpen } = this.state;
        return isOpen ? (
            <ClickOutside handleClickOutside={this.toggleCardComposer}>
                <form
                    onSubmit={this.handleSubmit}
                    className="card-adder-textarea-wrapper"
                >
                    <Textarea
                        autoFocus
                        useCacheForDOMMeasurements
                        minRows={1}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        value={newText}
                        className="card-adder-textarea"
                        placeholder="Add a new card..."
                        spellCheck={false}
                        onBlur={this.toggleCardComposer}
                    />
                </form>
            </ClickOutside>
        ) : (
            <button onClick={this.toggleCardComposer} className="add-card-button">
                +
            </button>
        );
    }
}

const mapDispatchToProps = { addCard };

export default connect(undefined, mapDispatchToProps)(CardAdder);
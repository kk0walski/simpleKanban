import React, { Component } from 'react';
import { FaTrash } from "react-icons/fa";
import { connect } from "react-redux";
import { removeCard, changeCardColor } from './boardSlice';
import "./CardOptions.scss";

class CardOptions extends Component {

    constructor() {
        super();
        this.state = { isCalendarOpen: false };
    }

    deleteCard = () => {
        const { listId, card } = this.props;
        this.props.removeCard({ cardId: card.id, listId })
    };

    changeColor = color => {
        const { card, toggleColorPicker } = this.props;
        if (card.color !== color) {
            this.props.changeCardColor({ color, cardId: card.id })
        }
        toggleColorPicker();
        this.colorPickerButton.focus();
    };

    handleKeyDown = event => {
        if (event.keyCode === 27) {
            this.props.toggleColorPicker();
            this.colorPickerButton.focus();
        }
    };

    render() {
        const { isCardNearRightBorder } = this.props;
        return (
            <div
                className="options-list"
                style={{
                    alignItems: isCardNearRightBorder ? "flex-end" : "flex-start"
                }}
            >
                <div>
                    <button onClick={this.deleteCard} className="options-list-button">
                        <div className="modal-icon">
                            <FaTrash />
                        </div>&nbsp;Delete
                    </button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = { removeCard, changeCardColor }

export default connect(undefined, mapDispatchToProps)(CardOptions);
import React, { Component } from 'react';
import { FaTrash } from "react-icons/fa";
import { connect } from "react-redux";
import { removeCard, changeCardColor } from './boardSlice';
import ClickOutside from "./ClickOutside";
import colorIcon from "../../assets/color-icon.png";
import "./CardOptions.scss";

class CardOptions extends Component {

    constructor() {
        super();
        this.state = { isCalendarOpen: false };
        this.handleClickOutside = this.handleClickOutside.bind(this)
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

    handleClickOutside = (e) => {
        e.preventDefault()
        const { toggleColorPicker } = this.props;
        toggleColorPicker(e);
        this.colorPickerButton.focus();
    };

    render() {
        const { isCardNearRightBorder, isColorPickerOpen } = this.props;
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
                <div className="modal-color-picker-wrapper">
                    <button
                        className="options-list-button"
                        onClick={this.props.toggleColorPicker}
                        onKeyDown={this.handleKeyDown}
                        ref={ref => {
                            this.colorPickerButton = ref;
                        }}
                        aria-haspopup
                        aria-expanded={isColorPickerOpen}
                    >
                        <img src={colorIcon} alt="colorwheel" className="modal-icon" />
                        &nbsp;Color
                    </button>
                    {isColorPickerOpen && (
                        <ClickOutside
                            eventTypes="click"
                            handleClickOutside={this.handleClickOutside}
                        >
                            {/* eslint-disable */}
                            <div
                                className="modal-color-picker"
                                onKeyDown={this.handleKeyDown}
                            >
                                {/* eslint-enable */}
                                {["white", "#6df", "#6f6", "#ff6", "#fa4", "#f66"].map(
                                    color => (
                                        <button
                                            key={color}
                                            style={{ background: color }}
                                            className="color-picker-color"
                                            onClick={() => this.changeColor(color)}
                                        />
                                    )
                                )}
                            </div>
                        </ClickOutside>
                    )}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = { removeCard, changeCardColor }

export default connect(undefined, mapDispatchToProps)(CardOptions);
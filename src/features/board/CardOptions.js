import React from 'react';
import { FaTrash } from "react-icons/fa";
import { connect } from "react-redux";
import { removeCard, changeCardColor } from './boardSlice';
import ClickOutside from "./ClickOutside";
import colorIcon from "../../assets/color-icon.png";
import "./CardOptions.scss";

class CardOptions extends React.Component {

    constructor() {
        super();
        this.state = { isCalendarOpen: false, isColorPickerOpen: false, buttonClicked: false };
    }


    toggleColorPicker = (e) => {
        if (e) {
            e.preventDefault();
            this.setState({ isColorPickerOpen: !this.state.isColorPickerOpen, buttonColorClicked: true });
        }
    };

    deleteCard = () => {
        const { listId, card } = this.props;
        this.props.removeCard({ cardId: card.id, listId })
    };

    changeColor = color => {
        const { card } = this.props;
        if (card.color !== color) {
            this.props.changeCardColor({ color, cardId: card.id })
        }
        this.toggleColorPicker();
        this.colorPickerButton.focus();
    };

    handleKeyDown = event => {
        if (event.keyCode === 27) {
            this.toggleColorPicker();
            this.colorPickerButton.focus();
        }
    };

    handleClickOutside = (e) => {
        e.preventDefault();
        this.colorPickerButton.focus();
        if (this.state.buttonColorClicked) {
            this.setState({ buttonColorClicked: false })
        } else {
            this.setState({ isColorPickerOpen: !this.state.isColorPickerOpen })
        }
    };

    render() {
        const { isCardNearRightBorder } = this.props;
        const { isColorPickerOpen } = this.state;
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
                        onClick={this.toggleColorPicker}
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
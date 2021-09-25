import React, { Component } from 'react'
import Modal from "react-modal";
import Textarea from "react-textarea-autosize";
import CardBadges from './CardBadges';
import { connect } from "react-redux";
import { editCard } from '../features/board/boardSlice';
import { findCheckboxes } from '../features/board/utils';
import CardOptions from "./CardOptions";
import "../styles/CardModal.scss";

class CardModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newText: props.card.content,
            isTextareaFocused: true
        };
        if (typeof document !== "undefined") {
            Modal.setAppElement("#root");
        }
    }

    handleKeyDown = event => {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();
            this.submitCard();
        }
    };

    submitCard = () => {
        const { newText } = this.state;
        const { card, toggleCardEditor } = this.props;
        if (newText === "") {
            this.deleteCard();
        } else if (newText !== card.text) {
            this.props.editCard({ cardId: card.id, cardText: newText })
        }
        toggleCardEditor();
    };

    handleChange = event => {
        this.setState({ newText: event.target.value });
    };

    handleRequestClose = () => {
        const { isColorPickerOpen } = this.state;
        const { toggleCardEditor } = this.props;
        if (!isColorPickerOpen) {
            toggleCardEditor();
        }
    };

    render() {
        const { newText, isColorPickerOpen, isTextareaFocused } = this.state;
        const { cardElement, card, listId, isOpen } = this.props;
        if (!cardElement) {
            return null;
        }

        // Get number of checked and total checkboxes
        const checkboxes = findCheckboxes(newText);
        // Get dimensions of the card to calculate dimensions of cardModal.
        const boundingRect = cardElement.getBoundingClientRect();
        // Returns true if card is closer to right border than to the left
        const isCardNearRightBorder =
            window.innerWidth - boundingRect.right < boundingRect.left;
        // Check if the display is so thin that we need to trigger a centered, vertical layout
        // DO NOT CHANGE the number 550 without also changing related media-query in CardOptions.scss
        const isThinDisplay = window.innerWidth < 550;

        const style = {
            content: {
                top: Math.min(
                    boundingRect.top,
                    window.innerHeight - boundingRect.height - 18
                ),
                left: isCardNearRightBorder ? null : boundingRect.left,
                right: isCardNearRightBorder
                    ? window.innerWidth - boundingRect.right
                    : null,
                flexDirection: isCardNearRightBorder ? "row-reverse" : "row"
            }
        };

        const mobileStyle = {
            content: {
                flexDirection: "column",
                top: 3,
                left: 3,
                right: 3
            }
        };

        return (
            <Modal
                closeTimeoutMS={150}
                isOpen={isOpen}
                onRequestClose={this.handleRequestClose}
                contentLabel="Card editor"
                overlayClassName="modal-underlay"
                className="modal"
                style={isThinDisplay ? mobileStyle : style}
                includeDefaultStyles={false}
                onClick={this.handleRequestClose}
            >
                <div
                    className="modal-textarea-wrapper"
                    style={{
                        minHeight: isThinDisplay ? "none" : boundingRect.height,
                        width: isThinDisplay ? "100%" : boundingRect.width,
                        boxShadow: isTextareaFocused
                            ? "0px 0px 3px 2px rgb(0, 180, 255)"
                            : null,
                        background: card.color
                    }}
                >
                    <Textarea
                        autoFocus
                        cacheMeasurements
                        value={newText}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        className="modal-textarea"
                        spellCheck={false}
                        onFocus={() => this.setState({ isTextareaFocused: true })}
                        onBlur={() => this.setState({ isTextareaFocused: false })}
                    />
                    {(card.date || checkboxes.total > 0) && (
                        <CardBadges date={card.date} checkboxes={checkboxes} />
                    )}
                </div>
                <CardOptions
                    isColorPickerOpen={isColorPickerOpen}
                    card={card}
                    listId={listId}
                    boundingRect={boundingRect}
                    isCardNearRightBorder={isCardNearRightBorder}
                    isThinDisplay={isThinDisplay}
                />
            </Modal>
        );
    }
}

const mapDispatchToProps = { editCard }

export default connect(undefined, mapDispatchToProps)(CardModal);
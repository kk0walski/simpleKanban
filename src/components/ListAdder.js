import { nanoid } from 'nanoid';
import React, { Component } from 'react';
import { connect } from "react-redux";
import { addList } from '../features/board/boardSlice';
import Textarea from "react-textarea-autosize";
import "../styles/ListAdder.scss";

class ListAdder extends Component {

    constructor() {
        super();
        this.state = {
            isOpen: false,
            listTitle: ""
        };
    }

    handleBlur = () => {
        this.setState({ isOpen: false });
    };

    handleChange = event => {
        this.setState({ listTitle: event.target.value });
    };

    handleKeyDown = event => {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.handleSubmit();
        } else if (event.keyCode === 27) {
            this.setState({ isOpen: false, listTitle: "" });
        }
    };

    handleSubmit = () => {
        const { listTitle } = this.state;
        const listId = nanoid();
        if (listTitle === "") return;
        this.props.addList({ listTitle, listId })
        this.setState({ isOpen: false, listTitle: "" });
    };

    render() {
        const { isOpen, listTitle } = this.state;
        if (!isOpen) {
            return (
                <button
                    onClick={() => this.setState({ isOpen: true })}
                    className="add-list-button"
                >
                    Add a new list...
                </button>
            );
        }
        return (
            <div className="list">
                <Textarea
                    autoFocus
                    useCacheForDOMMeasurements
                    value={listTitle}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    className="list-adder-textarea"
                    onBlur={this.handleBlur}
                    spellCheck={false}
                />
            </div>
        );
    }
}

const mapDispatchToProps = { addList };

export default connect(undefined, mapDispatchToProps)(ListAdder);
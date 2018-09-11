import React, { Component } from 'react';
import ClickOutside from './ClickOutside';
import Textarea from "react-textarea-autosize";

export default class CardAdder extends Component {

    constructor() {
        super();
        this.state = {
            newTitle: "",
            newText: "",
            isOpen: false
        };
    }

    toggleCardComposer = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    render() {
        const { newTitle, newText, isOpen } = this.state;
        return isOpen ? (
            <ClickOutside handleClickOutside={this.toggleCardComposer}>
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
                        value={newTitle}
                        placeholder="Text"
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

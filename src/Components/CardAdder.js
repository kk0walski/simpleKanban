import React, { Component } from 'react';
import ClickOutside from './ClickOutside';
import Textarea from "react-textarea-autosize";
import styled from 'styled-components';

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props => (props.isDragging ? 'lightgreen' : 'white')};
`;

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
                <Container>
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
                            value={newText}
                            placeholder="Text"
                        />
                    </form>
                </Container>
            </ClickOutside>
        ) : (
                <button onClick={this.toggleCardComposer} className="add-card-button">
                    +
            </button>
            );
    }
}

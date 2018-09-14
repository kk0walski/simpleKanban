import React, { Component } from 'react';
import ClickOutside from './ClickOutside';
import { connect } from "react-redux";
import shortid from "shortid";
import Textarea from "react-textarea-autosize";
import { startAddCard } from '../actions/dataActions';

class CardAdder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newTitle: "",
            newContent: "",
            isOpen: false
        };
        this.addCard = this.addCard.bind(this);
    }

    toggleCardComposer = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    titleChange = event => {
        this.setState({ newTitle: event.target.value });
    };

    contentChange = event => {
        this.setState({ newContent: event.target.value });
    }

    addCard(event) {
        event.preventDefault();
        const { listId } = this.props;
        const { newTitle, newContent } = this.state;
        const cardId = shortid.generate()
        if (newTitle !== "" && newContent !== "") {
            this.props.startAddCard(listId, cardId, newTitle, newContent)
        }
        this.toggleCardComposer()
    }

    render() {
        const { newTitle, newText, isOpen } = this.state;
        return isOpen ? (
            <ClickOutside handleClickOutside={this.toggleCardComposer}>
                <div className="cardContainer">
                    <form onSubmit={this.addCard}>
                        <Textarea
                            autoFocus
                            useCacheForDOMMeasurements
                            minRows={1}
                            value={newTitle}
                            onChange={this.titleChange}
                            placeholder="Title"
                        />
                        <Textarea
                            autoFocus
                            useCacheForDOMMeasurements
                            minRows={1}
                            value={newText}
                            onChange={this.contentChange}
                            placeholder="Text"
                        />
                        <input type="submit" value="ADD CARD" className="successButton" />
                    </form>
                </div>
            </ClickOutside>
        ) : (
                <button onClick={this.toggleCardComposer} className="add-card-button">
                    +
            </button>
            );
    }
}

const mapDispatchToProps = (dispatch) => ({
    startAddCard: (listId, cardId, newTitle, newContent) => dispatch(startAddCard(listId, cardId, newTitle, newContent))
  });

export default connect(undefined, mapDispatchToProps)(CardAdder)
import React, { Component } from 'react';
import ClickOutside from './ClickOutside';
import { connect } from "react-redux";
import shortid from "shortid";
import Textarea from "react-textarea-autosize";

class ListAdder extends Component {

  constructor() {
    super();
    this.state = {
      isOpen: false,
      listTitle: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleListComposer = () => {
    this.setState({ isOpen: !this.state.isOpen })
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
    const { dispatch } = this.props;
    const listId = shortid.generate();
    if (listTitle === "") return;
    dispatch({
      type: "ADD_LIST",
      payload: {
        listId,
        title: listTitle
      }
    })
    this.setState({ isOpen: false, listTitle: "" });
  };

  render = () => {
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
      <ClickOutside handleClickOutside={this.toggleListComposer}>
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
      </ClickOutside>
    );
  };
}

export default connect()(ListAdder)
import React, { Component } from 'react';
import { connect } from "react-redux";
import { changeTitle } from '../features/board/boardSlice';
import "../styles/BoardTitle.scss";

class BoardTitle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      newTitle: props.boardTitle
    };
  }

  handleClick = () => {
    this.setState({ isOpen: true });
  };

  handleChange = event => {
    this.setState({ newTitle: event.target.value });
  };

  submitTitle = () => {
    const { boardTitle } = this.props;
    const { newTitle } = this.state;
    if (newTitle === "") return;
    if (boardTitle !== newTitle) {
      this.props.changeTitle({ newTitle })
    }
    this.setState({ isOpen: false });
  };

  revertTitle = () => {
    const { boardTitle } = this.props;
    this.setState({ newTitle: boardTitle, isOpen: false });
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      this.submitTitle();
    } else if (event.keyCode === 27) {
      this.revertTitle();
    }
  };

  handleFocus = event => {
    event.target.select();
  };

  render() {
    const { isOpen, newTitle } = this.state;
    const { boardTitle } = this.props;
    return isOpen ? (
      <input
        autoFocus
        value={newTitle}
        type="text"
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        onBlur={this.revertTitle}
        onFocus={this.handleFocus}
        className="board-title-input"
        spellCheck={false}
      />
    ) : (
      <button className="board-title-button" onClick={this.handleClick}>
        <h1 className="board-title-text">{boardTitle}</h1>
      </button>
    );
  }
}

const mapDispatchToProps = { changeTitle };

export default connect(undefined, mapDispatchToProps)(BoardTitle);
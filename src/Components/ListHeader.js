import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import { FaTrash } from "react-icons/fa";

class ListHeader extends Component {
    static propTypes = {
        listTitle: PropTypes.string.isRequired,
        listId: PropTypes.string.isRequired,
        dragHandleProps: PropTypes.object.isRequired,
      };

    constructor(props) {
        super(props);
        this.state = {
          isOpen: false,
          newTitle: props.listTitle
        };
      }
    
      handleChange = event => {
        this.setState({ newTitle: event.target.value });
      };
    
      handleKeyDown = event => {
        if (event.keyCode === 13) {
          event.preventDefault();
          this.handleSubmit();
        } else if (event.keyCode === 27) {
          this.revertTitle();
        }
      };
    
      handleSubmit = () => {
        const { newTitle } = this.state;
        const { boardId, listTitle, listId } = this.props;
        if (newTitle === "") return;
        if (newTitle !== listTitle) {
          this.props.startChangeListName(boardId, listId, newTitle);
        }
        this.setState({ isOpen: false });
      };
    
      revertTitle = () => {
        this.setState({ newTitle: this.props.listTitle, isOpen: false });
      };
    
      deleteList = () => {
        const { listId, boardId } = this.props;
        this.props.startDeleteList(boardId, listId);
      };
    
      openTitleEditor = () => {
        this.setState({ isOpen: true });
      };
    
      handleButtonKeyDown = event => {
        if (event.keyCode === 13) {
          event.preventDefault();
          this.openTitleEditor();
        }
      };

    render() {
        const { isOpen, newTitle } = this.state;
        const { dragHandleProps, listTitle } = this.props;
        console.log("Title: ", listTitle)
        return (
          <div className="list-header">
            {isOpen ? (
              <div className="list-title-textarea-wrapper">
                <Textarea
                  autoFocus
                  useCacheForDOMMeasurements
                  value={newTitle}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  className="list-title-textarea"
                  onBlur={this.handleSubmit}
                  spellCheck={false}
                />
              </div>
            ) : (
                <div
                  {...dragHandleProps}
                  role="button"
                  tabIndex={0}
                  onClick={this.openTitleEditor}
                  onKeyDown={event => {
                    this.handleButtonKeyDown(event);
                    dragHandleProps.onKeyDown(event);
                  }}
                  className="list-title-button"
                >
                  {listTitle}
                </div>
              )}
            <Wrapper className="delete-list-wrapper" onSelection={this.deleteList}>
              <Button className="delete-list-button">
                <FaTrash />
              </Button>
              <Menu className="delete-list-menu">
                <div className="delete-list-header">Are you sure?</div>
                <MenuItem className="delete-list-confirm">Delete</MenuItem>
              </Menu>
            </Wrapper>
          </div>
        );
      }
}


export default connect()(ListHeader);
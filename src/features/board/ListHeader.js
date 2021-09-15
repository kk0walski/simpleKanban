
import React, { Component } from "react";
import "./ListHeader.scss";

export default class ListTitle extends Component {
  render() {
    return (
      <div className="list-header">
        <div
            {...this.props.dragHandleProps}
            role="button"
            tabIndex={0}
            className="list-title-button"
          >
            {this.props.listTitle}
          </div>
      </div>
    );
  }
}
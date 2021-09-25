import React, { Component } from "react";
import { MdDoneAll } from 'react-icons/md';
import "../styles/CardBadges.scss";

class CardBadges extends Component {
  // Render badge showing amoung of checkboxes that are checked
  renderTaskProgress = () => {
    const { total, checked } = this.props.checkboxes;
    if (total === 0) {
      return null;
    }
    return (
      <div
        className="badge"
        style={{ background: checked === total ? "green" : "#444" }}
      >
        <MdDoneAll className="badge-icon" />&nbsp;
        {checked}/{total}
      </div>
    );
  };

  render() {
    return (
      <div className="card-badges">
        {this.renderTaskProgress()}
      </div>
    );
  }
}

export default CardBadges;
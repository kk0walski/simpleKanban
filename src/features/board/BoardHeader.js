
import React from "react";
import BoardTitle from "./BoardTitle";
// import ColorPicker from "./ColorPicker";
// import BoardDeleter from "./BoardDeleter";
import "./BoardHeader.scss";

export default function Counter(props) {
    return (
        <div className="board-header">
          <BoardTitle boardTitle={props.boardTitle } />
          {/* <div className="board-header-right">
            <ColorPicker />
            <div className="vertical-line" />
            <BoardDeleter />
          </div> */}
        </div>
      );      
}

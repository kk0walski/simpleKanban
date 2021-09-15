import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { connect } from "react-redux";
import { move } from './boardSlice';
import classnames from "classnames";
import Column from './Column';
import "./Board.scss";


class InnerList extends React.PureComponent {
    render() {
        const { column, taskMap, index } = this.props;
        const tasks = column.taskIds.map(taskId => taskMap[taskId]);
        return <Column column={column} tasks={tasks} index={index} />
    }
}

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          startX: null,
          startScrollX: null
        };
    }

    handleMouseDown = ({ target, clientX }) => {
        if (target.className !== "list-wrapper" && target.className !== "lists") {
            return;
        }
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);
        this.setState({
            startX: clientX,
            startScrollX: window.scrollX
        });
    };

    // Go to new scroll position every time the mouse moves while dragging is activated
    handleMouseMove = ({ clientX }) => {
        const { startX, startScrollX } = this.state;
        const scrollX = startScrollX - clientX + startX;
        window.scrollTo(scrollX, 0);
        const windowScrollX = window.scrollX;
        if (scrollX !== windowScrollX) {
            this.setState({
                startX: clientX + windowScrollX - startScrollX
            });
        }
    };

    // Remove drag event listeners
    handleMouseUp = () => {
        if (this.state.startX) {
            window.removeEventListener("mousemove", this.handleMouseMove);
            window.removeEventListener("mouseup", this.handleMouseUp);
            this.setState({ startX: null, startScrollX: null });
        }
    };

    handleWheel = ({ target, deltaY }) => {
        // Scroll page right or left as long as the mouse is not hovering a card-list (which could have vertical scroll)
        if (
            target.className !== "list-wrapper" &&
            target.className !== "lists" &&
            target.className !== "open-composer-button" &&
            target.className !== "list-title-button"
        ) {
            return;
        }
        // Move the board 80 pixes on every wheel event
        if (Math.sign(deltaY) === 1) {
            window.scrollTo(window.scrollX + 80, 0);
        } else if (Math.sign(deltaY) === -1) {
            window.scrollTo(window.scrollX - 80, 0);
        }
    };

    render() {
        return (
            <div className={classnames("board", this.props.board.color)}>
                <div
                    className="lists-wrapper"
                    onMouseDown={this.handleMouseDown}
                    onWheel={this.handleWheel}
                >
                    <DragDropContext onDragEnd={(result) => this.props.move(result)}>
                        <Droppable droppableId="all-columns" direction="horizontal" type="column">
                            {provided => (
                                <div className="lists" ref={provided.innerRef}>
                                    {this.props.board.columnOrder.map((columnId, index) => {
                                        const column = this.props.board.columns[columnId];
                                        return <InnerList key={column.id} column={column} taskMap={this.props.board.tasks} index={index} />;
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div className="board-underlay" />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    board: state.board
})

const mapDispatchToProps = { move };

export default connect(mapStateToProps, mapDispatchToProps)(Board);
import React, { Component } from 'react'
import classnames from "classnames";
import { connect } from "react-redux";
import { changeColor } from './boardSlice';
import { FaCheck } from 'react-icons/fa';
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import colorIcon from "../../assets/color-icon.png";
import "./ColorPicker.scss";

class ColorPicker extends Component {

    handleSelection = color => {
        const { boardColor } = this.props;
        // Dispatch update only if selected color is not the same as current board color.
        if (color !== boardColor) {
            this.props.changeColor({ color })
        }
    };

    render() {
        const { boardColor } = this.props;
        const colors = ["blue", "green", "red", "pink"];
        return (
            <Wrapper
                className="color-picker-wrapper"
                onSelection={this.handleSelection}
            >
                <Button className="color-picker">
                    <img src={colorIcon} alt="colorwheel" className="modal-icon" />
                    <div className="board-header-right-text">
                        &nbsp;Color &nbsp;&#9662;
                    </div>
                </Button>
                <Menu className="color-picker-menu">
                    {colors.map(color => (
                        <MenuItem
                            value={color}
                            className={classnames("color-picker-item", color)}
                            key={color}
                        >
                            {color === boardColor && <FaCheck />}
                        </MenuItem>
                    ))}
                </Menu>
            </Wrapper>
        );
    }
}

const mapDispatchToProps = { changeColor };

export default connect(undefined, mapDispatchToProps)(ColorPicker);
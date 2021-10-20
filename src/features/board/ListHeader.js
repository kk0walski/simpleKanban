import React, { useState } from 'react';
import { useEditListMutation, useDeleteListMutation } from '../../services/board';
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import Textarea from "react-textarea-autosize";
import { FaTrash } from "react-icons/fa";

const ListHeader = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [newTitle, setNewTitle] = useState(props.listTitle)
    const [editList] = useEditListMutation()
    const [deleteList] = useDeleteListMutation()

    function handleChange(event) {
        setNewTitle(event.target.value)
    }

    async function handleSubmit() {
        const { listTitle, listId } = props
        if (newTitle === "") return;
        if (newTitle !== listTitle) {
            await editList({
                type: "CHANGE_LIST_NAME",
                payload: {
                    id: listId,
                    title: newTitle
                }
            })
        }
        setIsOpen(false)
    }

    function revertTitle() {
        setNewTitle(props.listTitle)
        setIsOpen(false)
    }

    async function handleKeyDown(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            await handleSubmit()
        } else if (event.keyCode === 27) {
            revertTitle()
        }
    }

    async function handleDeleteList() {
        const { listId } = props;
        deleteList({
            type: 'DELETE_LIST',
            payload: {
                id: listId
            }
        })
    }

    function openTitleEditor() {
        setIsOpen(true)
    }

    function handleButtonKeyDown(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            openTitleEditor();
        }
    }

    return <div className="list-header">
        {isOpen ? (
            <div className="list-title-textarea-wrapper">
                <Textarea
                    autoFocus
                    usecachefordommeasurements
                    value={newTitle}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="list-title-textarea"
                    onBlur={handleSubmit}
                    spellCheck={false}
                />
            </div>
        ) : (
            <div
                {...props.dragHandleProps}
                role="button"
                tabIndex={0}
                onClick={openTitleEditor}
                onKeyDown={event => {
                    handleButtonKeyDown(event);
                    props.dragHandleProps.onKeyDown(event);
                }}
                className="list-title-button"
            >
                {props.listTitle}
            </div>
        )}
        <Wrapper className="delete-list-wrapper" onSelection={handleDeleteList}>
            <Button className="delete-list-button">
                <FaTrash />
            </Button>
            <Menu className="delete-list-menu">
                <div className="delete-list-header">Are you sure?</div>
                <MenuItem className="delete-list-confirm">Delete</MenuItem>
            </Menu>
        </Wrapper>
    </div>
}

export default ListHeader
import React, { useState } from 'react';
import { useDeleteCardMutation, useEditCardMutation } from '../../services/board';
import ClickOutside from './ClickOutside';
import { Draggable } from 'react-beautiful-dnd';
import Textarea from "react-textarea-autosize";

const Card = (props) => {
    const [isEditingOpen, setIsEditingOpen] = useState(false)
    const [newTitle, setNewTitle] = useState(props.title)
    const [newContent, setNewContent] = useState(props.content)
    const [deleteCard] = useDeleteCardMutation()
    const [editCard] = useEditCardMutation()

    function toggleCardEditor() {
        setIsEditingOpen(!isEditingOpen)
    }

    function handleClick(event) {
        toggleCardEditor(event)
    }

    function titleChange(event) {
        setNewTitle(event.target.value)
    }

    function contentChange(event) {
        setNewContent(event.target.value)
    }

    async function handleDelete() {
        const { listId, card } = props;
        await deleteCard({
            type: "DELETE_CARD",
            payload: {
                listId,
                id: card.id
            }
        })
    }

    async function submitCard() {
        const { card } = props
        if (newTitle === "" && newContent === "") {
            await handleDelete();
        } else if (newTitle !== card.title || newContent !== card.content) {
            await editCard({
                type: "CHANGE_CARD_DATA",
                payload: {
                    id: card.id,
                    newTitle,
                    newContent
                }
            })
        }
        toggleCardEditor()
    }

    async function handleKeyDown(event) {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault();
            await submitCard()
        }
    }

    if (!isEditingOpen) {
        return <Draggable draggableId={props.card.id} index={props.index}>
            {(provided) => (
                <div
                    className="cardContainer"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={event => {
                        handleClick(event);
                    }}
                >
                    <div className="cardTitle">
                        {props.card.title}
                    </div>
                    {props.card.content}
                </div>
            )}
        </Draggable>
    } else {
        return <ClickOutside handleClickOutside={toggleCardEditor}>
            <div className="cardContainer">
                <form>
                    <Textarea
                        autoFocus
                        useCacheForDOMMeasurements
                        minRows={1}
                        value={newTitle}
                        onChange={titleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Title"
                    />
                    <Textarea
                        autoFocus
                        useCacheForDOMMeasurements
                        minRows={1}
                        value={newContent}
                        onChange={contentChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Text"
                    />
                </form>
                <div className="container">
                    <button className="successButton" onClick={submitCard}>
                        Submit
                    </button>
                    <button className="deleteButton" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </ClickOutside>
    }
}

export default Card
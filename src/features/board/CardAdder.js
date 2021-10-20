import shortid from "shortid";
import React, { useState } from 'react';
import ClickOutside from './ClickOutside';
import Textarea from "react-textarea-autosize";
import { useAddCardMutation } from '../../services/board';

const CardAdder = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [newTitle, setNewTitle] = useState(props.title)
    const [newContent, setNewContent] = useState(props.content)
    const [addCard] = useAddCardMutation()

    function toggleCardComposer() {
        setIsOpen(!isOpen)
    }

    function titleChange(event) {
        setNewTitle(event.target.value)
    }

    function contentChange(event) {
        setNewContent(event.target.value)
    }

    async function handleAddCard(event) {
        event.preventDefault();
        const { listId } = props;
        const cardId = shortid.generate();
        if (newTitle !== "" && newContent !== "") {
            await addCard({
                type: "ADD_CARD",
                payload: {
                    listId,
                    cardId,
                    title: newTitle,
                    content: newContent
                }
            })
        }
        toggleCardComposer()
    }

    return isOpen ? (
        <ClickOutside handleClickOutside={toggleCardComposer}>
            <div className="cardContainer">
                <form onSubmit={handleAddCard}>
                    <Textarea
                        autoFocus
                        usecachefordommeasurements
                        minRows={1}
                        value={newTitle}
                        onChange={titleChange}
                        placeholder="Title"
                    />
                    <Textarea
                        autoFocus
                        usecachefordommeasurements
                        minRows={1}
                        value={newContent}
                        onChange={contentChange}
                        placeholder="Text"
                    />
                    <input type="submit" value="ADD CARD" className="successButton" />
                </form>
            </div>
        </ClickOutside>
    ) : (
        <button onClick={toggleCardComposer} className="add-card-button">
            +
        </button>
    )
}

export default CardAdder
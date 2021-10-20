import shortid from "shortid";
import React, { useState } from 'react';
import ClickOutside from './ClickOutside';
import Textarea from "react-textarea-autosize";
import { useAddListMutation } from "../../services/board";


const ListAdder = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const [listTitle, setListTitle] = useState(props.listTitle)
    const [addList] = useAddListMutation()

    function toggleListComposer() {
        setIsOpen(!isOpen)
    }

    function handleBlur() {
        setIsOpen(false)
    }

    function handleChange(event) {
        setListTitle(event.target.value)
    }

    async function handleSubmit() {
        const listId = shortid.generate();
        if (listTitle === "") return;
        await addList({
            type: "ADD_LIST",
            payload: {
                listId,
                title: listTitle
            }
        })
        setIsOpen(false)
        setListTitle("")
    }

    async function handleKeyDown(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            handleSubmit()
        } else if (event.keyCode === 27) {
            setIsOpen(false)
            setListTitle("")
        }
    }

    if (!isOpen) {
        return <button
            onClick={() => setIsOpen(true)}
            className="add-list-button"
        >
            Add a new list...
        </button>

    } else {
        return <ClickOutside handleClickOutside={toggleListComposer}>
        <div className="list">
          <Textarea
            autoFocus
            usecachefordommeasurements
            value={listTitle}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="list-adder-textarea"
            onBlur={handleBlur}
            spellCheck={false}
          />
        </div>
      </ClickOutside>
    }
}

export default ListAdder;
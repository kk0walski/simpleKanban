// Give every card in a list an _id and the color white UNLESS those properties already exist
const appendAttributes = (list) => {
    let result = {}
    list.forEach(card => {
        const new_id = nanoid()
        result[new_id] = {id: new_id, content: card.text}
    });
    return result
}

const createList = (title) => {
    const new_id = nanoid()
    return {
        [new_id]: { id: new_id, title, taskIds: [] }
    }
}

// Generate the initial showcase board that every user and guest gets when they first log in
export default function createWelcomeBoard(boardId){
    const list1 = createList("Welcome to React Kanban!")
    const list1_cards = appendAttributes([
        { text: "### An open source application inspired by Trello" },
        {
            text: `![Octocat](https://i.pinimg.com/236x/fc/08/b9/fc08b9211d92eba4f97d8ac8e48da8f5--web-development-tutorial.jpg)
    Check out the [source code on GitHub](https://github.com/yogaboll/react-kanban)
    `,
            color: "#6df"
        }
    ]);
    list1[Object.keys(list1)[0]].taskIds = Object.keys(list1_cards)
    const list2 = createList("Features");
    const list2_cards = appendAttributes([
        {
            text: `### Supports GitHub flavored markdown
    Featuring cutting edge HTML features like
    * Headings
    * Bullet points
    * **Bold** and *italic* text
    * Links
    * Images
    * \`\`\`
    () => {
        // Code blocks
    }
    \`\`\`
    Watch out, Netscape navigator 2.0!`
        },
        {
            text: `### Works on mobile devices
    Unlike a certain other website...`
        },
        {
            text: `### And more!
    [x] Colors
    [x] Deadlines
    [x] Checkboxes`,
            color: "#ff6",
            date: new Date()
        }
    ])
    list2[Object.keys(list2)[0]].taskIds = Object.keys(list2_cards)
    const list3 = createList("How to use");
    const list3_cards = appendAttributes([
        {
            text: `### Sign in to save changes
Since you are not signed in, your changes will not persist after you leave the website. Go back to the login screen by pressing the 'Sign in' button in the top right corner.`
        },
        {
            text: `### Edit a card
You can edit the contents of a card by clicking on it. Remember to use Shift + Enter to create a newline.`
        },
        {
            text: `### Drag a card or list
Reposition cards and lists by dragging them with a mouse or touch gesture.`
        },
        {
            text: `### Create a card or list
Add a new card to an existing list by clicking the + button below each list. You can add a new list by clicking the "Add a list"-button to the right`
        },
        {
            text: `### Add a checklist
For a task that has many sub-tasks, you can create a checklist with markdown.
[x] Like this
[ ] Click me`
        },
        {
            text: `### Change the board
You can edit the title of the board by clicking it. You can also change the color of the board by clicking the button in the top right corner.`
        }
    ])
    list3[Object.keys(list3)[0]].taskIds = Object.keys(list3_cards)
    const board = {
        _id: boardId,
        title: "Tutorial board",
        color: "blue",
        columnOrder: [Object.keys(list1)[0], Object.keys(list2)[0], Object.keys(list3)[0]],
        columns: {
            [Object.keys(list1)[0]]: list1[Object.keys(list1)[0]],
            [Object.keys(list2)[0]]: list2[Object.keys(list2)[0]],
            [Object.keys(list3)[0]]: list3[Object.keys(list3)[0]]
        },
        cards: {
            ...list1_cards,
            ...list2_cards,
            ...list3_cards
        }
    };
    return board
};

export default createWelcomeBoard;
const initalData = {
    cards: {
        'card-1': { id: 'card-1', title: 'CARD1', content: 'Take out the garbage' },
        'card-2': { id: 'card-2', title: 'CARD2', content: 'Watch my favorite show' },
        'card-3': { id: 'card-3', title: 'CARD3', content: 'Charge your phone' },
        'card-4': { id: 'card-4', title: 'CARD4', content: 'Cook dinner' }
    },
    lists: {
        'list-1': {
            id: 'list-1',
            title: 'To do',
            cardIds: ['card-1', 'card-2', 'card-3', 'card-4'],
        },
        'list-2': {
            id: 'list-2',
            title: 'In progress',
            cardIds: []
        }
    },
    listOrder: ['list-1', 'list-2']
}

export default initalData;
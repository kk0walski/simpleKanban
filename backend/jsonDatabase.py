class JSONDatabase:

    def __init__(self):
        self.data = {'board': {'id': 1, 'lists': []}, 'cards': {}, 'lists': {}}

    def reset(self):
        self.data = {'board': [], 'cards': {}, 'lists': {}}

    def getData(self):
        reasult = {'board': self.data['board']['lists'], 'cards': self.data['cards'], 'lists': self.data['lists']}
        return reasult

    def deleteList(self, listId):
        newLists = self.data['board']['lists']
        newLists.remove(listId)
        self.data['board']['lists'] = newLists
        deleteList = self.data['lists'][listId]
        for cardId in deleteList['cards']:
            self.data['cards'].pop(cardId)
        self.data['lists'].pop(listId)
        reasult = {
            'lista': deleteList, 'lists': self.data['board']
            }
        return reasult

    def updateList(self, listId, newTitle):
        editList = self.data['lists'][listId]
        editList['title'] = newTitle
        self.data['lists'][listId] = editList
        return editList

    def moveInPlace(self, lista, oldIndex, newIndex):
        lista[oldIndex], lista[newIndex] = lista[newIndex], lista[oldIndex]

    def moveList(self, oldListIndex, newListIndex):
        boardLists = self.data['board']['lists']
        self.moveInPlace(boardLists, oldListIndex, newListIndex)
        self.data['board']['lists'] = boardLists
        return self.data['board']    

    def addList(self, payload):
        self.data['board']['lists'].append(payload['listId'])
        newList = {
            'id': payload['listId'],
            'title': payload['title'],
            'cards': []               
        }
        self.data['lists'][payload['listId']] = newList
        reasult = {
            'board': self.data['board'],
            'list': newList
        }
        return reasult
        
    def addCard(self, payload):
        editList = self.data['lists'][payload['listId']]
        editList.push(payload['cardId'])
        self.data['lists'][payload['listId']] = editList
        newCard = {
            'id': payload['cardId'],
            'title': payload['title'],
            'content': payload['content'],
            'lista': payload['listId']
        }
        self.data['cards'][payload['cardId']] = newCard
        reasult = {
            'card': newCard,
            'list': editList
        }
        return reasult
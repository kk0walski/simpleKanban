class JSONDatabase:

    def __init__(self):
        self.data = {'board': {'id': 1, 'lists': []}, 'cards': {}, 'lists': {}}

    def reset(self):
        self.data = {'board': [], 'cards': {}, 'lists': {}}

    def getData(self):
        reasult = {'board': self.data['board']['lists'],
                   'cards': self.data['cards'], 'lists': self.data['lists']}
        return reasult

    def deleteList(self, listId):
        self.data['board']['lists'].remove(listId)
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
        editList['cards'].append(payload['cardId'])
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

    def moveToList(self, lista1, lista2, oldIndex, newIndex):
        lista2.insert(newIndex, lista1.pop(oldIndex))

    def moveCard(self, payload):
        oldCardIndex = payload['oldCardIndex']
        newCardIndex = payload['newCardIndex']
        sourceListId = payload['sourceListId']
        destListId = payload['destListId']
        if sourceListId == destListId:
            lista1 = self.data['lists'][sourceListId]
            cardsOrder = lista1['cards']
            self.moveInPlace(cardsOrder, oldCardIndex, newCardIndex)
            lista1['cards'] = cardsOrder
            self.data['lists'][sourceListId] = lista1
            return {'lista': lista1}
        else:
            lista1 = self.data['lists'][sourceListId]
            lista2 = self.data['lists'][destListId]
            cardsOrder1 = lista1['cards']
            cardsOrder2 = lista2['cards']
            card = self.data['cards'][cardsOrder1[oldCardIndex]]
            card['lista'] = destListId
            self.data['cards'][card['id']] = card
            self.moveToList(cardsOrder1, cardsOrder2,
            oldCardIndex, newCardIndex)
            lista1['cards'] = cardsOrder1
            lista2['cards'] = cardsOrder2
            self.data['lists'][sourceListId] = lista1
            self.data['lists'][destListId] = lista2
            return {'lista1': lista1, 'lista2': lista2}

    def updateCard(self, cardId, newTitle, newContent):
        editCard = self.data['cards'][cardId]
        editCard['title'] = newTitle
        editCard['content'] = newContent
        self.data['cards'][cardId] = editCard
        return editCard

    def deleteCard(self, cardId):
        deleteCard = self.data['cards'][cardId]
        listId = deleteCard['lista']
        lista = self.data['lists'][listId]
        cardsOrder = lista['cards']
        cardsOrder.remove(cardId)
        lista['cards'] = cardsOrder
        self.data['cards'].pop(cardId)
        return deleteCard
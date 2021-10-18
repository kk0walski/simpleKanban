from setup_database import Board, Base, List, Card
from flask import jsonify


def moveInPlace(lista, oldIndex, newIndex):
        lista[oldIndex], lista[newIndex] = lista[newIndex], lista[oldIndex]


def getBoard(session):
    board = session.query(Board).first()
    result = {}
    result["board"] = board.serialize["lists"]
    result["lists"] = {}
    result["cards"] = {}
    lists = session.query(List).all()
    for i in lists:
        result["lists"][i.serialize["id"]] = i.serialize
    cards = session.query(Card).all()
    for i in cards:
        result["cards"][i.serialize["id"]] = i.serialize
    return jsonify(result)
            

def getLists(session, listId):
    result = {}
    lists = session.query(List).all()
    for lista in lists:
        result[lista.id] = lista.serialize
    return jsonify(result)


def getList(session, listId):
    _list = session.query(List).filter_by(id=listId).one()
    return jsonify(_list)


def moveList(session, payload):
    oldIndex = payload["oldListIndex"]
    newIndex = payload["newListIndex"]
    board = session.query(Board).first()
    lists = [] if board.listsOrder == '[]' else board.listsOrder[1:-1].split(', ')
    moveInPlace(lists, oldIndex, newIndex)
    board.listsOrder = '[' + ", ".join(lists) + ']'
    session.add(board)
    session.commit()
    return jsonify(board.serialize)


def createList(session, payload):
    listId = payload['listId']
    title = payload['title']
    board = session.query(Board).first()
    lists = [] if board.listsOrder == '[]' else board.listsOrder[1:-1].split(', ')
    lists.append(listId)
    board.listsOrder = '[' + ", ".join(lists) + ']'
    session.add(board)
    session.commit()
    lista = List(id=listId, title=title, cardsOrder='[]', board=1)
    session.add(lista)
    session.commit()
    return jsonify({'list': lista.serialize, 'board': board.serialize})


def updateList(session, listId, payload):
    title = payload["title"]
    _list = session.query(List).filter_by(id=listId).one()
    _list.title = title
    session.add(_list)
    session.commit()
    return jsonify(_list.serialize)


def deleteList(session, listId):
    board = session.query(Board).first()
    newLists = [] if board.listsOrder == '[]' else board.listsOrder[1:-1].split(', ')
    newLists.remove(listId)
    board.listsOrder = '[' + ", ".join(newLists) + ']'
    session.add(board)
    session.commit()
    _list = session.query(List).filter_by(id=listId).one()
    cardsOrder = [] if _list.cardsOrder == '[]' else _list.cardsOrder[1:-1].split(', ')
    session.query(Card).filter(Card.id.in_(cardsOrder)).delete()
    session.commit()
    session.delete(_list)
    session.commit()
    return jsonify({'lista': _list.serialize, 'lists': board.serialize})
    

def getCards(session):
    result = {}
    cards = session.query(Card).all()
    for card in cards:
        result[card.id] = card.serialize
    return jsonify(result)


def getCard(session, cardId):
    _card = session.query(Card).filter_by(id=cardId).one()
    return jsonify(_card.serialize)


def moveToList(lista1, lista2, oldIndex, newIndex):
    lista2.insert(newIndex, lista1.pop(oldIndex))


def addCard(session, payload):
    listId = payload["listId"]
    cardId = payload["cardId"]
    title = payload["title"]
    content = payload["content"]
    _list = session.query(List).filter_by(id=listId).one()
    cards = [] if _list.cardsOrder == '[]' else _list.cardsOrder[1:-1].split(', ')
    cards.append(cardId)
    _list.cardsOrder = '[' + ", ".join(cards) + ']'
    session.add(_list)
    session.commit()
    newCard = Card(id=cardId, title=title, content=content, lista=listId)
    session.add(newCard)
    session.commit()
    return jsonify({'card': newCard.serialize, 'list': _list.serialize})


def updateCard(session, cardId, payload):
    title = payload["newTitle"]
    content = payload["newContent"]
    _card = session.query(Card).filter_by(id=cardId).one()
    _card.title = title
    _card.content = content
    session.add(_card)
    session.commit()
    return jsonify(_card.serialize)


def moveCard(session, payload):
    oldCardIndex = payload["oldCardIndex"]
    newCardIndex = payload["newCardIndex"]
    sourceListId = payload["sourceListId"]
    destListId = payload["destListId"]
    if sourceListId == destListId:
        _list1 = session.query(List).filter_by(id=sourceListId).one()
        cardsOrder = (
            []
            if _list1.cardsOrder == "[]"
            else _list1.cardsOrder[1:-1].split(", ")
        )
        moveInPlace(cardsOrder, oldCardIndex, newCardIndex)
        _list1.cardsOrder = "[" + ", ".join(cardsOrder) + "]"
        session.add(_list1)
        session.commit()
        return jsonify({"lista": _list1.serialize})
    else:
        _list1 = session.query(List).filter_by(id=sourceListId).one()
        _list2 = session.query(List).filter_by(id=destListId).one()
        cardsOrder1 = (
            []
            if _list1.cardsOrder == "[]"
            else _list1.cardsOrder[1:-1].split(", ")
        )
        cardsOrder2 = (
            []
            if _list2.cardsOrder == "[]"
            else _list2.cardsOrder[1:-1].split(", ")
        )
        card = session.query(Card).filter_by(id=cardsOrder1[oldCardIndex]).one()
        card.lista = destListId
        session.add(card)
        session.commit()
        moveToList(cardsOrder1, cardsOrder2, oldCardIndex, newCardIndex)
        _list1.cardsOrder = "[" + ", ".join(cardsOrder1) + "]"
        _list2.cardsOrder = "[" + ", ".join(cardsOrder2) + "]"
        session.add(_list1)
        session.commit()
        session.add(_list2)
        session.commit()
        return jsonify({"lista1": _list1.serialize, "lista2": _list2.serialize})


def deleteCard(session, cardId):
    _card = session.query(Card).filter_by(id=cardId).one()
    listId = _card.lista
    _list = session.query(List).filter_by(id=listId).one()
    cardsOrder = [] if _list.cardsOrder == '[]' else _list.cardsOrder[1:-1].split(', ')
    cardsOrder.remove(cardId)
    _list.cardsOrder = '[' + ", ".join(cardsOrder) + ']'
    session.add(_list)
    session.commit()
    session.delete(_card)
    session.commit()
    return jsonify(_card.serialize) 
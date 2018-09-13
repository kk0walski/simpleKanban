import json
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from flask_cors import CORS, cross_origin
from setup_database import Board, Base, List, Card

app = Flask(__name__)
CORS(app)

engine = create_engine('sqlite:///board.db')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/api', methods=['POST'])
def json():
    print(request.is_json)
    content = request.get_json()
    print(content)
    return jsonify(content)


def moveInPlace(lista, oldIndex, newIndex):
    lista[oldIndex], lista[newIndex] = lista[newIndex], lista[oldIndex]


@app.route('/api/board', methods=['GET', 'PUT'])
def board():
    try:
        board = session.query(Board).first()
    except NoResultFound:
        return jsonify({'reasult': 'board not found', 'error': 404}), 404
    if request.method == 'GET':
        reasult = {}
        try:
            reasult["board"] = board.serialize["lists"]
            lists = session.query(List).all()
            for i in lists:
                reasult["lists"][i.serialize["id"]] = i.serialize
            cards = session.query(Card).all()
            for i in cards:
                reasult["cards"][i.serialize["id"]] = i.serialize
            return jsonify(reasult), 200
        except NoResultFound:
            return jsonify({'reasult': 'failuse', 'error': 404}), 404
    elif request.method == 'PUT':
        if request.is_json:
            payload = request.get_json()["payload"]
            oldIndex = payload['oldListIndex']
            newIndex = payload['newListIndex']
            lists = json.loads(board.listsOrder)
            moveInPlace(lists, oldIndex, newIndex)
            board.listsOrder = str(lists)
            session.add(board)
            session.commit()
            return jsonify(board.serialize()), 200
        else:
            return jsonify({'reasult': 'failure', 'error': 400}), 400


def moveToList(lista1, lista2, oldIndex, newIndex):
    lista2.insert(newIndex, lista1.pop(oldIndex))


@app.route('/api/lists', methods=['GET', 'POST', 'PUT'])
def cruLists():
    if request.method == 'GET':
        reasult = {}
        lists = session.query(List).all()
        for lista in lists:
            reasult[lista.id] = lista.serialize()
        return jsonify(reasult), 200
    elif request.method == 'POST':
        if request.is_json:
            payload = request.get_json()["payload"]
            lista = List(
                id=payload['listId'], title=payload['title'], cardsOrder='[]', board=1)
            session.add(lista)
            session.commit()
            return jsonify(lista.serialize), 200
        else:
            return jsonify({'reasult': 'failure', 'error': 400}), 400
    elif request.method == 'PUT':
        if request.is_json:
            try:
                payload = payload = request.get_json()["payload"]
                oldCardIndex = payload['oldCardIndex']
                newCardIndex = payload['newCardIndex']
                sourceListId = payload['sourceListId']
                destListId = payload['destListId']
                if sourceListId == destListId:
                    lista1 = session.query(List).filter_by(
                        id=sourceListId).one()
                    cardsOrder = json.loads(lista1.cardsOrder)
                    moveInPlace(cardsOrder, oldCardIndex, newCardIndex)
                    lista1.cardsOrder = str(cardsOrder)
                    session.add(lista1)
                    session.commit()
                    return jsonify({'reasult': 'success'}), 200
                else:
                    lista1 = session.query(List).filter_by(
                        id=sourceListId).one()
                    lista2 = session.query(List).filter_by(id=destListId).one()
                    cardsOrder1 = json.loads(lista1.cardsOrder)
                    cardsOrder2 = json.loads(lista2.cardsOrder)
                    card = session.query(Card).filter_by(
                        id=cardsOrder[oldCardIndex])
                    card.lista = destListId
                    session.add(card)
                    session.commit()
                    moveToList(cardsOrder1, cardsOrder2,
                               oldCardIndex, newCardIndex)
                    lista1.cardsOrder = str(cardsOrder1)
                    lista2.cardsOrder = str(cardsOrder2)
                    session.add(lista1)
                    session.commit()
                    session.add(lista2)
                    session.commit()
                    return jsonify({'reasult': 'success'}), 200
            except NoResultFound:
                return jsonify({'reasult': 'failuse', 'error': 404}), 404
        else:
            return jsonify({'reasult': 'failure', 'error': 400}), 400


@app.route('/api/lists/<string:list_id>', methods=['PUT', 'GET', 'DELETE'])
def rudList(list_id):
    try:
        editList = session.query(List).filter_by(id=list_id)
    except NoResultFound:
        jsonify({'reasult': 'failure', 'error': 404}), 404
    if request.method == 'PUT':
        if request.is_json:
            payload = request.get_json()["payload"]
            editList.title = payload['listTitle']
            session.add(editList)
            session.commit()
            return jsonify(editList.serialize), 200
        else:
            return jsonify({'reasult': 'failure', 'error': 400}), 400
    elif request.method == 'GET':
        return jsonify(editList.serialize), 200
    elif request.method == 'DELETE':
        board = session.query(Board).first()
        newLists = json.loads(board.listsOrder)
        newLists.remove(str(list_id))
        board.lists = str(newLists)
        session.add(board)
        session.commit()
        session.delete(editList)
        session.commit()
        return jsonify({'lista': editList.serialize, 'lists': newLists}), 200


@app.route('/api/cards', methods=['GET', 'POST'])
def crCards():
    if request.method == 'GET':
        reasult = {}
        cards = session.query(Card).all()
        for card in cards:
            reasult[card.id] = card.serialize
        return jsonify(reasult), 200
    if request.method == 'POST':
        if request.is_json:
            payload = request.get_json()["payload"]
            newCard = Card(id=payload['cardId'], title=payload['title'],
                           content=payload['content'], lista=payload['listId'])
            session.add(newCard)
            session.commit()
            return jsonify(newCard.serialize), 200
        else:
            return jsonify({'reasult': 'failure', 'error': 400}), 400


@app.route('/api/cards/<string:card_id>', methods=['GET', 'PUT', 'DELETE'])
def rudCard(card_id):
    try:
        editCard = session.query(Card).filter_by(id=card_id)
    except NoResultFound:
        jsonify({'reasult': 'failure', 'error': 404}), 404
    if request.method == 'PUT':
        if request.is_json:
            payload = request.get_json()["payload"]
            editCard.title = payload['newTitle']
            editCard.content = payload['newContent']
            session.add(editCard)
            session.commit()
            return jsonify(editCard.serialize), 200
        else:
            return jsonify({'reasult': 'failure', 'error': 400}), 400
    elif request.method == 'GET':
        return jsonify(editCard.serialize), 200
    elif request.method == 'DELETE':
        if request.is_json:
            try:
                listId = editCard.lista
                lista = session.query(List).filter_by(id=listId).one()
                cardsOrder = json.loads(lista.cardsOrder)
                cardsOrder.remove(card_id)
                lista.cardsOrder = str(cardsOrder)
                session.add(lista)
                session.commit()
                session.delete(editCard)
                session.commit()
                return jsonify(editCard.serialize), 200
            except NoResultFound:
                jsonify({'reasult': 'failure', 'error': 404}), 404
        else:
            return jsonify({'reasult': 'failure', 'error': 400}), 400


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)

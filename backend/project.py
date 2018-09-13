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


@app.route('/api/board', methods=['GET'])
def board():
    reasult = {}
    try:
        board = session.query(Board).first()
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


@app.route('/api/lists/<string:list_id>/<string:listTitle>', methods=['POST'])
def editList(list_id, listTitle):
    try:
        lista = session.query(List).filter_by(id=list_id).one()
        if request.method == 'POST':
            lista.title = listTitle
            session.add(lista)
            session.commit
            return jsonify(lista.serialize), 200
    except NoResultFound:
        if request.method == "POST":
            lista = List(title=listTitle, cardsOrder='[]', board=1)
            session.add(lista)
            session.commit()
            return jsonify(lista), 200
        return jsonify({'reasult': 'failuse', 'error': 404}), 404


@app.route('/api/lists/<string:list_id>', methods=['GET', 'DELETE'])
def getPostList(list_id):
    try:
        lista = session.query(List).filter_by(id=list_id).one()
        if request.method == 'GET':
            return jsonify(lista.serialize), 200
        elif request.method == 'DELETE':
            board = session.query(Board).first()
            newLists = json.loads(board.listsOrder)
            newLists.remove(str(list_id))
            board.lists = str(newLists)
            session.add(board)
            session.commit()
            session.delete(lista)
            session.commit()
            return jsonify(lista.serialize), 200
        else:
            return jsonify(lista.serialize), 200
    except NoResultFound:
        return jsonify({'reasult': 'failuse', 'error': 404}), 404


def moveInPlace(lista, oldIndex, newIndex):
    lista[oldIndex], lista[newIndex] = lista[newIndex], lista[oldIndex]


@app.route('/api/list/move/<int:oldIndex>/<int:newIndex>', methods=['POST'])
def moveList(oldIndex, newIndex):
    if request.is_json:
        try:
            editLists = session.query(Board).first()
            lists = json.loads(editLists.listsOrder)
            moveInPlace(lists, oldIndex, newIndex)
            editLists.listsOrder = str(lists)
            session.add(editLists)
            session.commit()
            return jsonify(editLists.serialize()), 200
        except NoResultFound:
            return jsonify({'reasult': 'failuse', 'error': 404}), 404


@app.route('/api/cards/<string:list_id>/<string:cardId>/<string:cardTitle>/<string:cardContent>', methods=['POST'])
def addCard(list_id, cardId, cardTitle, cardContent):
    if request.method == "POST":
        try:
            lista = session.query(List).filter_by(id=list_id).one()
            cardIds = json.loards(lista.cardsOrder)
            cardIds.append(cardId)
            session.add(lista)
            session.commit()
            card = Card(id=cardId, title=cardTitle, content=cardContent, lista=list_id)
            session.add(card)
            session.commit()
            return jsonify(card.serialize), 200
        except NoResultFound:
            return jsonify({'reasult': 'failuse', 'error': 404}), 404

@app.route('/api/cards/<string:card_id>/<string:newTitle>/<string:newContent>', methods=['POST'])
def editCard(cardId, newTitle, newContent):
    if request.method == "POST":
        try:
            card = session.query(Card).filter_by(id=cardId).one()
            card.title = newTitle
            card.content = newContent
            session.add(card)
            session.commit()
            return jsonify(card), 200
        except NoResultFound:
            return jsonify({'reasult': 'failuse', 'error': 404}), 404

def moveToList(lista1, lista2, oldIndex, newIndex):
    lista2.insert(newIndex, lista1.pop(oldIndex))

@app.route('/api/lists/move/<string:sourceListId>/<string:destListId>/<int:oldCardIndex>/<int:newCardIndex>', methods=['POST'])
def moveCard(sourceListId, destListId, oldCardIndex, newCardIndex):
    if request.method == 'POST':
        try:
            if sourceListId == destListId:
                lista1 = session.query(List).filter_by(id=sourceListId).one()
                cardsOrder = json.loads(lista1.cardsOrder)
                moveInPlace(cardsOrder, oldCardIndex, newCardIndex)
                lista1.cardsOrder=str(cardsOrder)
                session.add(lista1)
                session.commit()
                return jsonify({'reasult': 'success'}), 200
            else:
                lista1 = session.query(List).filter_by(id=sourceListId).one()
                lista2 = session.query(List).filter_by(id=destListId).one()
                cardsOrder1 = lista1.cardsOrder
                cardsOrder2 = lista2.cardsOrder
                moveToList(cardsOrder1, cardsOrder2, oldCardIndex, newCardIndex)
                lista1.cardsOrder = str(cardsOrder1)
                lista2.cardsOrder = str(cardsOrder2)
                session.add(lista1)
                session.commit()
                session.add(lista2)
                session.commit()
                return jsonify({'reasult': 'success'}), 200
        except NoResultFound:
            return jsonify({'reasult': 'failuse', 'error': 404}), 404

@app.route('/api/cards/<string:list_id>/<string:cardId>', methods=["DELETE"])
def deleteCard(list_id, card_id):
    if request.method == 'DELETE':
        try:
            lista = session.query(List).filter_by(id=list_id).one()
            cardsOrder = json.loads(lista.cardsOrder)
            cardsOrder.remove(card_id)
            lista.cardsOrder = str(cardsOrder)
            session.add(lista)
            session.commit()
            card = session.query(Card).filter_by(id=card_id).one()
            session.delete(card)
            session.commit()
            return jsonify({'reasult': 'success'}), 200
        except NoResultFound:
            return jsonify({'reasult': 'failuse', 'error': 404}), 404

@app.route('/api/cards/<string:card_id>', methods=['GET'])
def getCard(card_id):
    if request.methods == 'GET':
        try:
            card = session.query(Card).filter_by(id=card_id).one()
            return jsonify(card), 200
        except NoResultFound:
            return jsonify({'reasult': 'failuse', 'error': 404}), 404

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)

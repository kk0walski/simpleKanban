from flask import Flask, jsonify, request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from flask_cors import CORS, cross_origin
from configuration import BaseConfig, TestingConfig, DevelopmentConfig
from setup_database import Board, Base, List, Card


def create_app(test_config=False):
    app = Flask(__name__)
    if test_config:
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    engine = create_engine(app.config['DATABASE'])
    Base.metadata.bind = engine
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    CORS(app)

    @app.route('/')
    def hello_world():
        return 'Hello, World!'

    def moveInPlace(lista, oldIndex, newIndex):
        lista[oldIndex], lista[newIndex] = lista[newIndex], lista[oldIndex]

    @app.route('/api/board', methods=['GET', 'PUT'])
    def board():
        try:
            board = session.query(Board).first()
            if request.method == 'GET':
                reasult = {}
                reasult["board"] = board.serialize["lists"]
                reasult["lists"] = {}
                reasult["cards"] = {}
                lists = session.query(List).all()
                for i in lists:
                    reasult["lists"][i.serialize["id"]] = i.serialize
                cards = session.query(Card).all()
                for i in cards:
                    reasult["cards"][i.serialize["id"]] = i.serialize
                return jsonify(reasult), 200
            elif request.method == 'PUT':
                if request.is_json:
                    payload = request.get_json()["payload"]
                    oldIndex = payload['oldListIndex']
                    newIndex = payload['newListIndex']
                    lists = [] if board.listsOrder == '[]' else board.listsOrder[1:-
                                                                                 1].split(', ')
                    moveInPlace(lists, oldIndex, newIndex)
                    board.listsOrder = '[' + ", ".join(lists) + ']'
                    session.add(board)
                    session.commit()
                    return jsonify(board.serialize), 200
                else:
                    return jsonify({'reasult': 'failure', 'error': 400}), 400
        except NoResultFound:
            return jsonify({'reasult': 'board not found', 'error': 404}), 404

    def moveToList(lista1, lista2, oldIndex, newIndex):
        lista2.insert(newIndex, lista1.pop(oldIndex))

    @app.route('/api/lists', methods=['GET', 'POST', 'PUT'])
    def cruLists():
        if request.method == 'GET':
            reasult = {}
            lists = session.query(List).all()
            for lista in lists:
                reasult[lista.id] = lista.serialize
            return jsonify(reasult), 200
        elif request.method == 'POST':
            if request.is_json:
                try:
                    payload = request.get_json()["payload"]
                    if 'listId' not in payload or 'title' not in payload:
                        return jsonify({'reasult': 'wrong arguments', 'error': 400}), 400
                    board = session.query(Board).first()
                    lists = [] if board.listsOrder == '[]' else board.listsOrder[1:-1].split(', ')
                    lists.append(payload['listId'])
                    board.listsOrder = '[' + ", ".join(lists) + ']'
                    session.add(board)
                    session.commit()
                    lista = List(id=payload['listId'], title=payload['title'], cardsOrder='[]', board=1)
                    session.add(lista)
                    session.commit()
                    return jsonify({'list': lista.serialize, 'board': board.serialize}), 200
                except NoResultFound:
                    return jsonify({'reasult': 'failuse', 'error': 404}), 404
            else:
                return jsonify({'reasult': 'arguments no json', 'error': 400}), 400
        elif request.method == 'PUT':
            if request.is_json:
                try:
                    payload = request.get_json()["payload"]
                    if ('oldCardIndex' not in payload or
                        'newCardIndex' not in payload or
                        'sourceListId' not in payload or 
                        'destListId' not in payload):
                        return jsonify({'reasult': 'wrong arguments', 'error': 400}), 400
                    oldCardIndex = payload['oldCardIndex']
                    newCardIndex = payload['newCardIndex']
                    sourceListId = payload['sourceListId']
                    destListId = payload['destListId']
                    if sourceListId == destListId:
                        lista1 = session.query(List).filter_by(
                            id=sourceListId).one()
                        cardsOrder = [] if lista1.cardsOrder == '[]' else lista1.cardsOrder[1:-
                                                                                            1].split(', ')
                        moveInPlace(cardsOrder, oldCardIndex, newCardIndex)
                        lista1.cardsOrder = '[' + ", ".join(cardsOrder) + ']'
                        session.add(lista1)
                        session.commit()
                        return jsonify({'reasult': 'success'}), 200
                    else:
                        lista1 = session.query(List).filter_by(
                            id=sourceListId).one()
                        lista2 = session.query(List).filter_by(
                            id=destListId).one()
                        cardsOrder1 = [] if lista1.cardsOrder == '[]' else lista1.cardsOrder[1:-
                                                                                             1].split(', ')
                        cardsOrder2 = [] if lista2.cardsOrder == '[]' else lista2.cardsOrder[1:-
                                                                                             1].split(', ')
                        card = session.query(Card).filter_by(
                            id=cardsOrder1[oldCardIndex]).one()
                        card.lista = destListId
                        session.add(card)
                        session.commit()
                        moveToList(cardsOrder1, cardsOrder2,
                                   oldCardIndex, newCardIndex)
                        lista1.cardsOrder = '[' + ", ".join(cardsOrder1) + ']'
                        lista2.cardsOrder = '[' + ", ".join(cardsOrder2) + ']'
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
            editList = session.query(List).filter_by(id=list_id).one()
            if request.method == 'PUT':
                if request.is_json:
                    payload = request.get_json()["payload"]
                    editList.title = payload['title']
                    session.add(editList)
                    session.commit()
                    return jsonify(editList.serialize), 200
                else:
                    return jsonify({'reasult': 'failure', 'error': 400}), 400
            elif request.method == 'GET':
                return jsonify(editList.serialize), 200
            elif request.method == 'DELETE':
                board = session.query(Board).first()
                newLists = [] if board.listsOrder == '[]' else board.listsOrder[1:-
                                                                                1].split(', ')
                newLists.remove(list_id)
                print(newLists)
                board.listsOrder = '[' + ", ".join(newLists) + ']'
                session.add(board)
                session.commit()
                session.delete(editList)
                session.commit()
                return jsonify({'lista': editList.serialize, 'lists': board.serialize}), 200
        except NoResultFound:
            jsonify({'reasult': 'failure', 'error': 404}), 404

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
                try:
                    payload = request.get_json()["payload"]
                    lista = session.query(List).filter_by(
                        id=payload['listId']).one()
                    cards = [] if lista.cardsOrder == '[]' else lista.cardsOrder[1:-
                                                                                 1].split(', ')
                    cards.append(payload['cardId'])
                    lista.cardsOrder = '[' + ", ".join(cards) + ']'
                    session.add(lista)
                    session.commit()
                    newCard = Card(id=payload['cardId'], title=payload['title'],
                                   content=payload['content'], lista=payload['listId'])
                    session.add(newCard)
                    session.commit()
                    return jsonify({'card': newCard.serialize, 'list': lista.serialize}), 200
                except NoResultFound:
                    return jsonify({'reasult': 'failuse', 'error': 404}), 404
            else:
                return jsonify({'reasult': 'failure', 'error': 400}), 400

    @app.route('/api/cards/<string:card_id>', methods=['GET', 'PUT', 'DELETE'])
    def rudCard(card_id):
        try:
            editCard = session.query(Card).filter_by(id=card_id).one()
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
                listId = editCard.lista
                lista = session.query(List).filter_by(id=listId).one()
                cardsOrder = [] if lista.cardsOrder == '[]' else lista.cardsOrder[1:-
                                                                                  1].split(', ')
                cardsOrder.remove(card_id)
                lista.cardsOrder = '[' + ", ".join(cardsOrder) + ']'
                session.add(lista)
                session.commit()
                session.delete(editCard)
                session.commit()
                return jsonify(editCard.serialize), 200
        except NoResultFound:
            return jsonify({'reasult': 'failure', 'error': 404}), 404

    return app

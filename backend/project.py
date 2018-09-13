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
        return jsonify({'reasult' : 'failuse', 'error': 404}), 404


@app.route('/api/list/<int:list_id>/<string:newTitle>', methods=["POST"])
def addList(list_id, newTitle):
    try:
        lista = session.query(List).filter_by(id=list_id).one()
        if request.method == "POST":
            lista.title = newTitle
            session.add(lista)
            session.commit()
            return jsonify(lista)
    except NoResultFound:
        return jsonify({'reasult' : 'failuse', 'error': 404}), 404

@app.route('/api/list/<int:list_id>', methods=['GET', 'DELETE'])
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
        return jsonify({'reasult' : 'failuse', 'error': 404}), 404

def moveInPlace(lista, oldIndex, newIndex):
    lista[oldIndex],lista[newIndex]=lista[newIndex],lista[oldIndex]

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
            return jsonify({'reasult' : 'failuse', 'error': 404}), 404

@app.route('/api/cards/<int:list_id>/<int:card_id>', methods=['POST'])
def addCard(list_id, card_id):
    if request.is_json:
        try:
            lista = session.query(List).filter_by(id=list_id).one()
            data = request.get_json()
            lista.cards = str(data['cards'])
            newCard = Card(id=data['id'], title=data['title'], content=data['content'])
            session.add(newCard)
            session.commit()
        except NoResultFound:
            return jsonify({'reasult' : 'failuse', 'error': 404}), 404

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)

from flask import Flask, jsonify, request
from sqlalchemy import create_engine
from setup_database import Base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from flask_cors import CORS, cross_origin
from configuration import BaseConfig, TestingConfig, DevelopmentConfig
from databaseFunctions import (
    deleteCard,
    getBoard,
    getLists,
    getList,
    moveList,
    createList,
    updateList,
    deleteList,
    getCards,
    moveCard,
    getCard,
    addCard,
    updateCard,
    deleteCard,
)


def create_app(test_config=False):
    app = Flask(__name__)
    if test_config:
        app.config.from_object(TestingConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    engine = create_engine(app.config["DATABASE"])
    Base.metadata.bind = engine
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    CORS(app)

    @app.route("/")
    def hello_world():
        return "Hello, World!"

    def moveInPlace(lista, oldIndex, newIndex):
        lista[oldIndex], lista[newIndex] = lista[newIndex], lista[oldIndex]

    @app.route("/api/board", methods=["GET", "PUT"])
    def board():
        try:
            if request.method == "GET":
                return getBoard(session), 200
            elif request.method == "PUT":
                if request.is_json:
                    return moveList(session, request.get_json()["payload"]), 200
                else:
                    return jsonify({"reasult": "failure", "error": 400}), 400
        except NoResultFound:
            return jsonify({"reasult": "board not found", "error": 404}), 404
        except KeyError as e:
            return (
                jsonify(
                    {"reasult": 'I got a KeyError - reason "%s"' % str(e), "error": 400}
                ),
                400,
            )

    def moveToList(lista1, lista2, oldIndex, newIndex):
        lista2.insert(newIndex, lista1.pop(oldIndex))

    @app.route("/api/lists", methods=["GET", "POST", "PUT"])
    def cruLists():
        if request.method == "GET":
            return getLists(session), 200
        elif request.method == "POST":
            if request.is_json:
                try:
                    return (
                        createList(session, request.get_json()["payload"]),
                        200,
                    )
                except NoResultFound:
                    return jsonify({"reasult": "failuse", "error": 404}), 404
                except KeyError as e:
                    return (
                        jsonify(
                            {
                                "reasult": 'I got a KeyError - reason "%s"' % str(e),
                                "error": 400,
                            }
                        ),
                        400,
                    )
            else:
                return jsonify({"reasult": "arguments no json", "error": 400}), 400
        elif request.method == "PUT":
            if request.is_json:
                try:
                    return (
                        moveCard(session, request.get_json()["payload"]),
                        200,
                    )
                except NoResultFound:
                    return jsonify({"reasult": "failuse", "error": 404}), 404
                except KeyError as e:
                    return (
                        jsonify(
                            {
                                "reasult": 'I got a KeyError - reason "%s"' % str(e),
                                "error": 400,
                            }
                        ),
                        400,
                    )
            else:
                return jsonify({"reasult": "failure", "error": 400}), 400

    @app.route("/api/lists/<string:list_id>", methods=["PUT", "GET", "DELETE"])
    def rudList(list_id):
        try:
            if request.method == "PUT":
                if request.is_json:
                    return (
                        updateList(session, list_id, request.get_json()["payload"]),
                        200,
                    )
                else:
                    return jsonify({"reasult": "failure", "error": 400}), 400
            elif request.method == "GET":
                return getList(session, list_id), 200
            elif request.method == "DELETE":
                return (
                    deleteList(session, list_id),
                    200,
                )
        except NoResultFound:
            jsonify({"reasult": "failure", "error": 404}), 404
        except KeyError as e:
            return (
                jsonify(
                    {
                        "reasult": 'I got a KeyError - reason "%s"' % str(e),
                        "error": 400,
                    }
                ),
                400,
            )

    @app.route("/api/cards", methods=["GET", "POST"])
    def crCards():
        if request.method == "GET":
            return getCards(session), 200
        if request.method == "POST":
            if request.is_json:
                try:
                    return (
                        addCard(session, request.get_json()["payload"]),
                        200,
                    )
                except NoResultFound:
                    return jsonify({"reasult": "failuse", "error": 404}), 404
                except KeyError as e:
                    return (
                        jsonify(
                            {
                                "reasult": 'I got a KeyError - reason "%s"' % str(e),
                                "error": 400,
                            }
                        ),
                        400,
                    )
            else:
                return jsonify({"reasult": "failure", "error": 400}), 400

    @app.route("/api/cards/<string:card_id>", methods=["GET", "PUT", "DELETE"])
    def rudCard(card_id):
        try:
            if request.method == "PUT":
                if request.is_json:
                    return (
                        updateCard(session, card_id, request.get_json()["payload"]),
                        200,
                    )
                else:
                    return jsonify({"reasult": "failure", "error": 400}), 400
            elif request.method == "GET":
                return getCard(session, card_id), 200
            elif request.method == "DELETE":
                return deleteCard(session, card_id), 200
        except NoResultFound:
            return jsonify({"reasult": "failure", "error": 404}), 404
        except KeyError as e:
            return (
                jsonify(
                    {
                        "reasult": 'I got a KeyError - reason "%s"' % str(e),
                        "error": 400,
                    }
                ),
                400,
            )

    return app

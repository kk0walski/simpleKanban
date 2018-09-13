from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
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

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
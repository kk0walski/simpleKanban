import os
import sys
import json
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class Board(Base):
    __tablename__ = 'Board'

    id = Column(Integer, primary_key=True)
    lists = Column(String, nullable=False)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'lists': json.loads(self.lists)
        }

class List(Base):
    __tablename__ = "List"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    cards = Column(String, nullable=False)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'cards': json.loads(self.lists)
        }

class Card(Base):
    __tablename__ = "Card"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content
        }

engine = create_engine('sqlite:///board.db')

Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
Base.metadata.create_all(engine)
session = DBSession()
board = Board(lists='[]')
session.add(board)
session.commit()
session.close()
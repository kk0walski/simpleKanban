import os
import sys
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, relationship

Base = declarative_base()

class Board(Base):
    __tablename__ = 'board'

    id = Column(Integer, primary_key=True)
    listsOrder = Column(String, nullable=False)
    lists = relationship("List", cascade='all,delete-orphan')

    @property
    def serialize(self):
        return {
            'id': self.id,
            'lists': [] if self.listsOrder == '[]' else self.listsOrder[1:-1].split(', ')
        }

class List(Base):
    __tablename__ = "list"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    cardsOrder = Column(String, nullable=False)
    board = Column(String, ForeignKey('board.id'), nullable=False)
    cards = relationship("Card", cascade='all,delete-orphan')

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'cards': [] if self.cardsOrder == '[]' else self.cardsOrder[1:-1].split(', ')
        }

class Card(Base):
    __tablename__ = "card"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    lista = Column(String, ForeignKey('list.id'), nullable=False)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content
        }
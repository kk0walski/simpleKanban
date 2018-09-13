from sqlalchemy.orm import sessionmaker
from setup_database import Board
from sqlalchemy import create_engine

engine = create_engine('sqlite:///board.db')
DBSession = sessionmaker(bind=engine)
session = DBSession()
board = Board(listsOrder='[]')
session.add(board)
session.commit()
session.close()
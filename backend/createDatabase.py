from sqlalchemy import create_engine
from setup_database import Base, Board
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///board.db')
Base.metadata.bind = engine
Base.metadata.create_all(engine)
DBSession = sessionmaker(bind=engine)
session = DBSession()
board = Board(listsOrder='[]')
session.add(board)
session.commit()
session.close()


def create(database):
    engine = create_engine(database)
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)
    DBSession = sessionmaker(bind=engine)
    session = DBSession()
    board = Board(listsOrder='[]')
    session.add(board)
    session.commit()
    session.close()

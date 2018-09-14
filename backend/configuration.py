class BaseConfig(object):
    DEBUG = False
    TESTING = False
    DATABASE = 'sqlite:///board.db'


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    DATABASE = 'sqlite:///board.db'

class TestingConfig(BaseConfig):
    DEBUG = False
    TESTING = True
    DATABASE = 'sqlite:///test.db'
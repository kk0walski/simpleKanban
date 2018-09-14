from createDatabase import create
from setup_database import Board, Base, List, Card
from project import create_app
import unittest
import os


class FlaskTestCase(unittest.TestCase):
    
    def setUp(self):
        self.app = create_app(True)
        self.tester = self.app.test_client()
        create('sqlite:///test.db')

    def test_hello(self):
        response = self.tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    def test_empty_board(self):
        response = self.tester.get('/api/board', content_type='json/text')
        message = response.get_json()
        self.assertEqual(len(message['board']), 0)
        self.assertFalse(message['cards'])
        self.assertFalse(message['lists'])
        self.assertEqual(response.status_code, 200)

    def tearDown(self):
        os.remove('test.db')

if __name__ == '__main__':
    unittest.main()

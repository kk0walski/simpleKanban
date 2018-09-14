import json
from createDatabase import create
from setup_database import Board, Base, List, Card
from project import create_app
import unittest
import os
from jsonDatabase import JSONDatabase


class FlaskTestCase(unittest.TestCase):
    
    def setUp(self):
        self.app = create_app(True)
        self.tester = self.app.test_client()
        create('sqlite:///test.db')
        self.testDatabase = JSONDatabase()

    def test_hello(self):
        response = self.tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    def test_empty_board(self):
        response = self.tester.get('/api/board', content_type='json/text')
        message = response.get_json()
        self.assertEqual(message, self.testDatabase.getData())
        self.assertEqual(response.status_code, 200)

    def delete_list(self, listId, title, length=0):
        response = self.tester.delete('/api/lists/{}'.format(listId), content_type='json/text')
        message = response.get_json()
        self.assertEqual(message['lista'], {'id': listId, 'title': title, 'cards': []})
        self.assertEqual(len(message['lists']['lists']), length)
        self.assertEqual(response.status_code, 200)

    def add_list(self, listId, title, length=1):
        newList = {'listId': listId, 'title': title}
        lista = {'payload': newList}
        response = self.tester.post('/api/lists', data=json.dumps(lista), content_type='application/json')
        message = response.get_json()
        self.assertEqual(message, self.testDatabase.addList(newList))
        self.assertEqual(response.status_code, 200)

    def test_add_and_delete_list(self):
        self.add_list('list-1', 'list-1')
        self.add_list('list-2', 'list-2', 2)

        response = self.tester.get('/api/board', content_type='json/text')
        message = response.get_json()
        self.assertFalse(message['cards'])
        self.assertEqual(message['lists']['list-1'], {'id': 'list-1', 'title': 'list-1', 'cards': []})
        self.assertEqual(message['board'], ['list-1', 'list-2'])
        self.assertEqual(response.status_code, 200)

        self.delete_list('list-1', 'list-1', 1)

    def test_wrong_add(self):
        lista = {'payload': {'listId': 'list-1'}}
        response = self.tester.post('/api/lists', data=json.dumps(lista), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        


    def tearDown(self):
        os.remove('test.db')
        self.testDatabase.reset()

if __name__ == '__main__':
    unittest.main()

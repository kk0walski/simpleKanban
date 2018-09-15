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

    def getBoard(self):
        response = self.tester.get('/api/board', content_type='json/text')
        message = response.get_json()
        self.assertEqual(message, self.testDatabase.getData())
        self.assertEqual(response.status_code, 200)

    def delete_list(self, listId):
        response = self.tester.delete('/api/lists/{}'.format(listId), content_type='json/text')
        message = response.get_json()
        self.assertEqual(message, self.testDatabase.deleteList(listId))
        self.assertEqual(response.status_code, 200)

    def update_list(self, listId, newTitle):
        newListData = {'id': listId, 'title': newTitle}
        payload = {'payload': newListData}
        response = self.tester.put('/api/lists/{}'.format(listId), data=json.dumps(payload), content_type='application/json')
        message = response.get_json()
        self.assertEqual(message, self.testDatabase.updateList(listId, newTitle))
        self.assertEqual(response.status_code, 200)

    def add_list(self, listId, title):
        newList = {'listId': listId, 'title': title}
        payload = {'payload': newList}
        response = self.tester.post('/api/lists', data=json.dumps(payload), content_type='application/json')
        message = response.get_json()
        self.assertEqual(message, self.testDatabase.addList(newList))
        self.assertEqual(response.status_code, 200)

    def moveList(self, oldListIndex, newListIndex):
        moveData = {'oldListIndex':oldListIndex, 'newListIndex':newListIndex}
        payload = {'payload': moveData}
        response = self.tester.put('/api/board', data=json.dumps(payload), content_type='application/json')
        message = response.get_json()
        self.assertEqual(message, self.testDatabase.moveList(oldListIndex, newListIndex))
        self.assertEqual(response.status_code, 200)

    def add_card(self, listId, cardId, cardTitle, cardContent):
        newCard = {'listId': listId, 'cardId': cardId, 'title': cardTitle, 'content': cardContent}
        payload = {'payload': newCard}
        response = self.tester.post('/api/cards', data=json.dumps(payload), content_type='application/json')
        message = response.get_json()
        self.assertEqual(message, self.testDatabase.addCard(newCard))
        self.assertEqual(response.status_code, 200)


    def test_hello(self):
        response = self.tester.get('/', content_type='html/text')
        self.assertEqual(response.status_code, 200)

    def test_empty_board(self):
        self.getBoard()

    def testCRUDList(self):
        self.add_list('list-1', 'list-1')
        self.add_card('list-1', 'card-1', 'card-1', 'content-card-1')
        self.add_list('list-2', 'list-2')
        self.getBoard()
        self.moveList(0,1)
        self.update_list('list-2', 'testing')
        self.delete_list('list-1')
        self.getBoard()

    def test_wrong_add(self):
        lista = {'payload': {'listId': 'list-1'}}
        response = self.tester.post('/api/lists', data=json.dumps(lista), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def tearDown(self):
        os.remove('test.db')
        self.testDatabase.reset()

if __name__ == '__main__':
    unittest.main()

class JSONDatabase:

    def __init__(self):
        self.data = {'board': {'id': 1, 'lists': []}, 'cards': {}, 'lists': {}}

    def reset(self):
        self.data = {'board': [], 'cards': {}, 'lists': {}}

    def getData(self):
        reasult = {'board': self.data['board']['lists'], 'cards': self.data['cards'], 'lists': self.data['lists']}
        return reasult

    def addList(self, payload):
        self.data['board']['lists'].append(payload['listId'])
        self.data['lists'] = {
            payload['listId']: {'id': payload['listId'],
                                'title': payload['title'],
                                'cards': []
                                }
        }
        reasult = {
            'board': self.data['board'],
            'list': self.data['lists'][payload['listId']]
        }
        return reasult

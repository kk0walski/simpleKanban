import { getBoard } from '../../actions/dataActions'
import testData from '../../initial-data'

test('should get cards objects', () => {
    const action = getBoard(testData)
    expect(action).toEqual({
        type: 'SET_BOARD',
        payload: {
            data: testData
        }
    });
})
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import BoardContainer from '../components/BoardContainer';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <BoardContainer />
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});

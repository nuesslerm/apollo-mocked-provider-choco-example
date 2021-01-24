import React from 'react';
import { createApolloLoadingProvider } from '../src';
import { render } from '@testing-library/react';
import { TodoApp } from './Todo';

test('works with defaults', async () => {
  const MockedProvider = createApolloLoadingProvider();
  const { getByText } = render(
    <MockedProvider>
      <TodoApp id={'dafsdf'} />
    </MockedProvider>
  );

  expect(getByText('Loading...')).toBeTruthy();
});

import React from 'react';
import { createApolloLoadingProvider } from '../../src';
import { render } from '@testing-library/react';
import UserTest from '../UserTest';

test('works with defaults', async () => {
  const MockedProvider = createApolloLoadingProvider();
  const { getByText } = render(
    <MockedProvider>
      <UserTest id={'dafsdf'} />
    </MockedProvider>
  );

  expect(getByText('Loading...')).toBeTruthy();
});

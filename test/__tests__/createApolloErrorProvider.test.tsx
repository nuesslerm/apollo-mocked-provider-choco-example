import React from 'react';
import { createApolloErrorProvider } from '../../src';
import { render, waitFor } from '@testing-library/react';
import UserTest from '../UserTest';
import { GraphQLError } from 'graphql';

test('works with defaults', async () => {
  const ERROR_MESSAGE = 'Something terrible happened on the way to the moon.';
  const MockedProvider = createApolloErrorProvider();

  const { getByText } = render(
    <MockedProvider graphQLErrors={[new GraphQLError(ERROR_MESSAGE)]}>
      <UserTest id={'hello'} />
    </MockedProvider>
  );

  await waitFor(() =>
    expect(getByText(ERROR_MESSAGE, { exact: false })).toBeTruthy()
  );
});

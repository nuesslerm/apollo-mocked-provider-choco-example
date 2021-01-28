import React from 'react';
import { createApolloErrorProvider } from '../../src';
import { render, waitFor } from '@testing-library/react';
import UserTest from '../UserTest';
import { GraphQLError } from 'graphql';

test('works with defaults', async () => {
  const MockedProvider = createApolloErrorProvider();
  const { getByText } = render(
    <MockedProvider
      graphQLErrors={[
        new GraphQLError('Something terrible happened on the way to the moon.'),
      ]}
    >
      <UserTest id={'hello'} />
    </MockedProvider>
  );

  await waitFor(() =>
    expect(getByText('Error!', { exact: false })).toBeTruthy()
  );
});

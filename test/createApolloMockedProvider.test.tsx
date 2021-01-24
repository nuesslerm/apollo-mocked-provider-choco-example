import React from 'react';
import { createApolloMockedProvider } from '../src';
import { readFileSync } from 'fs';
import { render, waitFor } from '@testing-library/react';
import { TodoApp } from './Todo';
import path from 'path';

const typeDefs = readFileSync(
  path.join(__dirname, 'fixtures/chocoSchema.graphql'),
  'utf8'
);

// console.log('typeDefs', typeDefs);

test('works with defaults', async () => {
  const MockedProvider = createApolloMockedProvider(typeDefs);

  const { getByTestId } = render(
    <MockedProvider>
      <TodoApp id={'Hello'} />
    </MockedProvider>
  );

  await waitFor(() => {});
  const todoList = getByTestId('todolist');
  expect(todoList).toBeTruthy();
});

test('works with custom resolvers', async () => {
  const MockedProvider = createApolloMockedProvider(typeDefs);
  const mockResolvers = {
    Query: () => ({
      user: (_root: any, { id }: { id: string }) => {
        switch (id) {
          case 'MarkusId':
            return { name: 'Markus' };
          default:
            return { name: 'HelloWhatUp' };
        }
      },
    }),
  };

  const { getByText } = render(
    <MockedProvider customResolvers={mockResolvers}>
      <TodoApp id={'MarkusId'} />
    </MockedProvider>
  );

  await waitFor(() => {});
  expect(getByText('Markus')).toBeTruthy();
});

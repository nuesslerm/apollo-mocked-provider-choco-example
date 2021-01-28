import React from 'react';
import { createApolloMockedProvider } from '../src';
import { readFileSync } from 'fs';
import { render, waitFor } from '@testing-library/react';
import UserTest from './UserTest';
import path from 'path';
import OrdersPage from './OrdersPage';
import { MockList } from 'graphql-tools';

const typeDefs = readFileSync(
  path.join(__dirname, 'fixtures/chocoSchema.graphql'),
  'utf8'
);

// console.log('typeDefs', typeDefs);

test('works with defaults', async () => {
  const MockedProvider = createApolloMockedProvider(typeDefs);

  const { getByTestId } = render(
    <MockedProvider>
      <UserTest id={'Hello'} />
    </MockedProvider>
  );

  await waitFor(() => expect(getByTestId('usertest')).toBeTruthy());
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
      <UserTest id={'MarkusId'} />
    </MockedProvider>
  );

  await waitFor(() => {});
  expect(getByText('Markus')).toBeTruthy();
});

// const orders = [
//   { type: 'order', id: '1' },
//   { type: 'order', id: '2' },
//   { type: 'order', id: '3' },
//   { type: 'order', id: '3' },
// ];

it('works with custom resolvers for orders', async () => {
  const MockedProvider = createApolloMockedProvider(typeDefs);

  const mockResolvers = {
    AWSTimestamp: () => `${Math.floor(Math.random() * 1000)}`,
    Order: () => ({
      // id: 'asdf',
      referenceId: 'jooooo',
      // createdAt: 1592496720936,
      // deliveryDate: null,
    }),
    // SearchItem: () => ({
    //   id: '123',
    //   type: 'order',
    // }),
    SearchEntity: () => ({
      // id: '123',
      // referenceId: 'diojfai',
      // createdAt: 1592496720936,
      __typename: 'Order',
    }),
    Query: () => ({
      search: (
        _: any,
        { query: { search } }: { query: { search: string } }
      ) => ({
        total: search.length,
        hits: () => new MockList(search.length),
      }),
    }),
  };

  const { getAllByText } = render(
    <MockedProvider customResolvers={mockResolvers}>
      <OrdersPage ordersSearchTerm={'markus'} />
    </MockedProvider>
  );

  await waitFor(() => expect(getAllByText('jooooo')).toBeTruthy());
});

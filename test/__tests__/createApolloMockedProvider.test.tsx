import React from 'react';
// import { readFileSync } from 'fs';
// import path from 'path';
import { createApolloMockedProvider } from '../../src';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UserTest from '../UserTest';
import OrdersPage from '../OrdersPage';
import { ITypeDefinitions, MockList } from 'graphql-tools';
import { fetchTypeDefs } from '../../src/fetchTypeDefs';
import OrderConfirm from '../OrderConfirm';
import { OrderStatus } from '@chocoapp/appsync-client';

// const typeDefs = readFileSync(
//   path.join(__dirname, '../data/chocoSchema.graphql'),
//   'utf8'
// );

// console.log('typeDefs', typeDefs);

describe('Executable schema mocks', () => {
  let fetchedTypeDefs: ITypeDefinitions;

  beforeAll(async () => {
    fetchedTypeDefs = await fetchTypeDefs();
  });

  it('should work with defaults', async () => {
    const MockedProvider = createApolloMockedProvider(fetchedTypeDefs);

    const { getByTestId } = render(
      <MockedProvider>
        <UserTest id={'Hello'} />
      </MockedProvider>
    );

    await waitFor(() => expect(getByTestId('usertest')).toBeTruthy());
  });

  it('should work with custom resolvers', async () => {
    const MockedProvider = createApolloMockedProvider(fetchedTypeDefs);
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

  it('should work with custom resolvers for orders', async () => {
    const MockedProvider = createApolloMockedProvider(fetchedTypeDefs);
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

  xit('should work for mutations', async () => {
    // const ERROR_MESSAGE = 'Your order couldn\t be confirmed :(';

    const MockedProvider = createApolloMockedProvider(fetchedTypeDefs);
    const mockResolvers = {
      BatchOrderConfirmResponse: () => ({
        __typename: 'BatchOrderConfirmSuccess',
      }),
      // Mutation: () => ({
      //   batchOrderConfirm: (_: any, { ids }) => {},
      // }),
      // BatchOrderConfirmError: () => ({
      //   responseType: 'error',
      //   message: ERROR_MESSAGE,
      // }),
      BatchOrderConfirmSuccess: () => ({
        // responseType: 'success',
      }),
    };

    const { getByText } = render(
      <MockedProvider customResolvers={mockResolvers}>
        <OrderConfirm status={OrderStatus.Created} orderId={'123123'} />
      </MockedProvider>
    );

    fireEvent.click(getByText('confirmOrder'));
    await waitFor(() => {
      expect(getByText('BatchOrderConfirmSuccess')).toBeTruthy();
    });
  });
});

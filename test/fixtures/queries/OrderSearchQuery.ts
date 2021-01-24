import gql from 'graphql-tag';
import { SearchFilter } from '@chocoapp/appsync-client/dist/code/types';

import { OrderType } from '../../domain';

export type OrderHit = {
  entity: OrderType;
};

export type OrderSearchQueryType = {
  search: {
    total: number;
    hits: OrderHit[];
  };
};

export type OrderSearchQueryVariablesType = {
  search: string;
  offset: number;
  size: number;
  filter: SearchFilter;
};

export const OrderSearchQuery = gql`
  query OrderSearch(
    $search: String!
    $offset: Int
    $size: Int
    $filter: SearchFilter
  ) {
    search(
      query: {
        search: $search
        type: order
        offset: $offset
        size: $size
        filter: $filter
      }
    ) {
      total
      hits {
        entity {
          ... on Order {
            id
            referenceId
            deliveryDate
            restaurant {
              id
              restaurantName
            }
            orderProducts {
              amount
              product {
                id
                name
                unit
                externalId
              }
            }
            orderSupplierStatus
            createdAt
          }
        }
      }
    }
  }
`;

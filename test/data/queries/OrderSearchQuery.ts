import gql from 'graphql-tag';
import OrderType from '../types/OrderType';

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
};

export const OrderSearchQuery = gql`
  query OrderSearch($search: String!, $offset: Int, $size: Int) {
    search(
      query: { search: $search, type: order, offset: $offset, size: $size }
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

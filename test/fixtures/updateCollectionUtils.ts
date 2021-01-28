import OrderType from './OrderType';
import { OrderSearchQueryVariablesType } from './queries';

type FetchMoreOrdersType = {
  variables: OrderSearchQueryVariablesType;
  fetchMore: any;
  updateQuery: any;
  orders: OrderType[];
};

export const fetchMoreOrders = ({
  variables,
  orders,
  fetchMore,
  updateQuery,
}: FetchMoreOrdersType) => {
  // eslint-disable-next-line consistent-return
  return async () => {
    try {
      return await fetchMore({
        variables: {
          ...variables,
          offset: orders.length,
        },
        updateQuery,
      });
    } catch (err) {}
  };
};

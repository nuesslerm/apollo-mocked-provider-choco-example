import * as Sentry from '@sentry/browser';
import { OrderSearchQueryVariablesType } from './queries';
import { OrderType } from '../domain';

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
    } catch (err) {
      Sentry.captureException(new Error(err));
      // TODO: raise a toastr here use sentry
      // See depending issues below
    }
  };
};

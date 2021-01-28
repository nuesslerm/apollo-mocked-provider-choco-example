import { useQuery } from '@apollo/client';
import {
  OrderSearchQuery,
  OrderSearchQueryType,
  OrderSearchQueryVariablesType,
  OrderHit,
} from './queries';
import { get } from './get';
import {
  CollectionName,
  CollectionKey,
  updateQueryCollection,
} from './queryUtils';
import { fetchMoreOrders } from './updateCollectionUtils';

const extractOrdersIds = (hit: OrderHit) => hit.entity.id;
export const checkOrderIdExistence = (existingOrdersIds: string[]) => (
  hit: OrderHit
) => !existingOrdersIds.includes(hit.entity.id);

const updateOrders = () =>
  updateQueryCollection(
    CollectionName.ORDERS,
    CollectionKey.HITS,
    extractOrdersIds,
    checkOrderIdExistence
  );

export default function useOrderSearchQuery(
  variables: OrderSearchQueryVariablesType
) {
  const { data, loading, error, fetchMore } = useQuery<
    OrderSearchQueryType,
    OrderSearchQueryVariablesType
  >(OrderSearchQuery, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    variables,
  });

  // console.log(data, loading, error, fetchMore);

  const total = get(data, 'search.total', undefined) || 0;
  const hits = get(data, 'search.hits', undefined) || [];
  const orders = hits.map((hit: OrderHit) => hit.entity);

  return {
    total,
    orders,
    loading,
    error,
    fetchMore: fetchMoreOrders({
      variables,
      orders,
      fetchMore,
      updateQuery: updateOrders(),
    }),
  };
}

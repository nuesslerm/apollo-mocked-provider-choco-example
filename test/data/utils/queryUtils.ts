import { OrderType } from '../types';
import { get } from './get';

export type OrderHit = {
  entity: OrderType;
};

export enum CollectionName {
  CHATS = 'chats',
  MESSAGES = 'messages',
  ORDERS = 'search',
}

export enum CollectionKey {
  EDGES = 'edges',
  HITS = 'hits',
}

export const addItemsToCollection = (
  prev: any,
  current: any,
  collectionName: CollectionName,
  data: string,
  extractIds: (item: any) => string,
  checkIdExistence: (existingOrdersIds: string[]) => (item: any) => boolean
) => {
  const existingItemIds = get(prev, `${collectionName}.${data}`, []).map(
    extractIds
  );

  const newItems = get(current, `${collectionName}.${data}`, []).filter(
    checkIdExistence(existingItemIds)
  );

  if (!newItems.length) return prev;

  return {
    ...prev,
    [collectionName]: {
      ...prev[collectionName],
      [data]: [...prev[collectionName][data], ...newItems],
    },
  };
};

export const updateQueryCollection = (
  collectionName: CollectionName,
  data: string,
  extractIds: (item: OrderHit) => string,
  checkIdExistence: (existingIds: string[]) => (item: OrderHit) => boolean
) => (prev: any, { fetchMoreResult: current }: any) =>
  addItemsToCollection(
    prev,
    current,
    collectionName,
    data,
    extractIds,
    checkIdExistence
  );

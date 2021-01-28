import { pipe } from './pipe';
import { isNil } from './isNil';

const walkThroughCollection = (keys: string[]) => (obj: any) =>
  keys.reduce(
    (previous, current) => Boolean(previous) && previous[current],
    obj
  );

const generateFallback = (collection: any, fallback: any) => (result: any) =>
  isNil(result) || result === collection ? fallback : result;

export const get = (collection: any, path: string, fallback: any) => {
  const splitKeys = path ? path.split(/[,[\].]+?/).filter(Boolean) : [];

  return pipe(
    walkThroughCollection(splitKeys),
    generateFallback(collection, fallback)
  )(collection);
};

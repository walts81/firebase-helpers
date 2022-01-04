import { Query, onArrayOnce } from './firebase-service';

export const getFirebaseArray = async <T>(
  query: Query,
  mapArray?: (a: any[]) => T[],
  commit?: (mutation: string, data: T[]) => void,
  mutation?: string,
  firebaseConfig?: any
): Promise<Array<T>> => {
  const arr = await onArrayOnce(query, firebaseConfig);
  const mappedArr = !!mapArray ? mapArray(arr) : [...arr];
  if (!!commit && !!mutation) {
    commit(mutation, mappedArr);
  }
  return mappedArr;
};

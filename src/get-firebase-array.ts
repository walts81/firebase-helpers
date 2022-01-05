import { Query } from './firebase-types';
import { onArrayOnce } from './once';
import { getArgsToUse } from './args-helper';

function getFirebaseArray<T>(
  query: Query,
  firebaseConfig?: any
): Promise<Array<T>>;
function getFirebaseArray<T>(
  query: Query,
  mapArray: (arr: any[]) => T[],
  firebaseConfig?: any
): Promise<Array<T>>;
function getFirebaseArray<T>(
  query: Query,
  commit: (mutation: string, data: T[]) => void,
  mutation: string,
  firebaseConfig?: any
): Promise<Array<T>>;
function getFirebaseArray<T>(
  query: Query,
  mapArray: (arr: any[]) => T[],
  commit: (mutation: string, data: T[]) => void,
  mutation: string,
  firebaseConfig?: any
): Promise<Array<T>>;
async function getFirebaseArray(
  query: Query,
  mapArray?: any,
  commit?: any,
  mutation?: any,
  firebaseConfig?: any
) {
  const { mapArrToUse, commitToUse, mutationToUse, configToUse } = getArgsToUse(
    mapArray,
    commit,
    mutation,
    firebaseConfig
  );
  const arr = await onArrayOnce(query, configToUse);
  const mappedArr = mapArrToUse(arr);
  commitToUse(mutationToUse, mappedArr);
  return mappedArr;
}

export { getFirebaseArray };

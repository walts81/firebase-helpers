import * as service from './firebase-service';
import { DatabaseReference } from './firebase-types';
import { getArgsToUse } from './args-helper';

function updateItemInFirebaseArray<T extends { key: string }>(
  parentRef: DatabaseReference,
  item: T,
  arr: T[],
  firebaseConfig?: any
): Promise<Array<T>>;
function updateItemInFirebaseArray<T extends { key: string }>(
  parentRef: DatabaseReference,
  item: T,
  arr: T[],
  mappArr: (arr: T[]) => T[],
  firebaseConfig?: any
): Promise<Array<T>>;
function updateItemInFirebaseArray<T extends { key: string }>(
  parentRef: DatabaseReference,
  item: T,
  arr: T[],
  commit: (mutation: string, data: T[]) => void,
  mutation: string,
  firebaseConfig?: any
): Promise<Array<T>>;
function updateItemInFirebaseArray<T extends { key: string }>(
  parentRef: DatabaseReference,
  item: T,
  arr: T[],
  mappArr: (arr: T[]) => T[],
  commit: (mutation: string, data: T[]) => void,
  mutation: string,
  firebaseConfig?: any
): Promise<Array<T>>;
async function updateItemInFirebaseArray<T extends { key: string }>(
  parentRef: DatabaseReference,
  item: T,
  arr: T[],
  mapArr?: any,
  commit?: any,
  mutation?: any,
  firebaseConfig?: any
) {
  const { mapArrToUse, commitToUse, mutationToUse, configToUse } =
    getArgsToUse<T>(mapArr, commit, mutation, firebaseConfig);

  const clonedArr = mapArrToUse(arr);
  const ix = clonedArr.findIndex(x => x.key === item.key);
  if (ix > -1) {
    clonedArr.splice(ix, 1, item);
    commitToUse(mutationToUse, clonedArr);
  }
  if (!!item.key) {
    const path = service.getPath(parentRef, item.key);
    const dbRef = service.ref(path, configToUse);
    await service.update(dbRef, item, configToUse);
  }
  return clonedArr;
}

export { updateItemInFirebaseArray };

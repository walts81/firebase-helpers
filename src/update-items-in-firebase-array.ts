import * as service from './firebase-service';
import { DatabaseReference } from './firebase-types';

function updateItemsInFirebaseArray<T extends { key: string }>(
  parentRef: DatabaseReference,
  arr: T[],
  firebaseConfig?: any
): Promise<Array<T>>;
function updateItemsInFirebaseArray<T extends { key: string }>(
  parentRef: DatabaseReference,
  arr: T[],
  commit: (mutation: string, data: T[]) => void,
  mutation: string,
  firebaseConfig?: any
): Promise<Array<T>>;
async function updateItemsInFirebaseArray<T extends { key: string }>(
  parentRef: DatabaseReference,
  arr: T[],
  commit?: any,
  mutation?: any,
  firebaseConfig?: any
) {
  const configToUse =
    !!commit && typeof commit === 'object' ? commit : firebaseConfig;

  for (const item of arr.filter(x => !!x.key)) {
    const path = service.getPath(parentRef, item.key);
    const dbRef = service.ref(path, configToUse);
    await service.update(dbRef, item, configToUse);
  }
  const commitToUse: any =
    !!commit && typeof commit === 'function' ? commit : () => ({});
  const mutationToUse =
    !!mutation && typeof mutation === 'string' ? mutation : '';

  commitToUse(mutationToUse, arr);
  return arr;
}

export { updateItemsInFirebaseArray };

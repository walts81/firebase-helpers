import * as service from './firebase-service';
import { DatabaseReference } from './firebase-types';

function initFirebaseArray<T extends { key: string }>(
  dbRef: DatabaseReference,
  arr: T[],
  firebaseConfig?: any
): Promise<Array<T>>;
function initFirebaseArray<T extends { key: string }>(
  dbRef: DatabaseReference,
  arr: T[],
  commit: (mutation: string, data: T[]) => void,
  mutation: string,
  firebaseConfig?: any
): Promise<Array<T>>;
async function initFirebaseArray<T extends { key: string }>(
  dbRef: DatabaseReference,
  arr: T[],
  commit?: any,
  mutation?: any,
  firebaseConfig?: any
) {
  const configToUse =
    !!commit && typeof commit === 'object' ? commit : firebaseConfig;

  await service.remove(dbRef, configToUse);
  for (const item of arr) {
    const snapshot = await service.push(dbRef, item);
    item.key = snapshot.key as any;
    const newRef = service.ref(snapshot.ref.toString(), configToUse);
    await service.update(newRef, item, configToUse);
  }

  const commitToUse: any =
    !!commit && typeof commit === 'function' ? commit : () => ({});
  const mutationToUse =
    !!mutation && typeof mutation === 'string' ? mutation : '';

  commitToUse(mutationToUse, arr);
  return arr;
}

export { initFirebaseArray };

import { DatabaseReference, getPath, ref, update } from './firebase-service';

export const updateFirebaseArray = async <T extends { key: string }>(
  parentRef: DatabaseReference,
  arr: T[],
  commit?: (mutation: string, data: T[]) => void,
  mutation?: string,
  firebaseConfig?: any
) => {
  for (const item of arr) {
    const path = getPath(parentRef, item.key);
    const dbRef = ref(path, firebaseConfig);
    await update(dbRef, item, firebaseConfig);
  }
  if (!!commit && !!mutation) {
    commit(mutation, arr);
  }
};

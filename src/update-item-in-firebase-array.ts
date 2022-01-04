import { DatabaseReference, getPath, ref, update } from './firebase-service';

export const updateItemInFirebaseArray = async <T extends { key: string }>(
  parentRef: DatabaseReference,
  item: T,
  arr: T[],
  mapArr?: (a: T[]) => T[],
  commit?: (mutation: string, data: T[]) => void,
  mutation?: string,
  firebaseConfig?: any
) => {
  const clonedArr = !!mapArr ? mapArr(arr) : [...arr];
  const ix = clonedArr.findIndex(x => x.key === item.key);
  if (ix > -1) {
    clonedArr.splice(ix, 1, item);
    if (!!commit && !!mutation) {
      commit(mutation, clonedArr);
    }
  }
  if (!!item.key) {
    const path = getPath(parentRef, item.key);
    const dbRef = ref(path, firebaseConfig);
    await update(dbRef, item, firebaseConfig);
  }
};

import { FirebaseService } from './firebase-service';
import { DatabaseReference } from './firebase-types';

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
    const path = FirebaseService.instance.getPath(parentRef, item.key);
    const dbRef = FirebaseService.instance.ref(path, firebaseConfig);
    await FirebaseService.instance.update(dbRef, item, firebaseConfig);
  }
};

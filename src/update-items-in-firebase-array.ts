import { FirebaseService } from './firebase-service';
import { DatabaseReference } from './firebase-types';

export const updateItemsInFirebaseArray = async <T extends { key: string }>(
  parentRef: DatabaseReference,
  arr: T[],
  commit?: (mutation: string, data: T[]) => void,
  mutation?: string,
  firebaseConfig?: any
) => {
  for (const item of arr) {
    const path = FirebaseService.instance.getPath(parentRef, item.key);
    const dbRef = FirebaseService.instance.ref(path, firebaseConfig);
    await FirebaseService.instance.update(dbRef, item, firebaseConfig);
  }
  if (!!commit && !!mutation) {
    commit(mutation, arr);
  }
};

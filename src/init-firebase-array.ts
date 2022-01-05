import { FirebaseService } from './firebase-service';
import { DatabaseReference } from './firebase-types';

export const initFirebaseArray = async <T extends { key: string }>(
  dbRef: DatabaseReference,
  arr: T[],
  commit?: (mutation: string, data: T[]) => void,
  mutation?: string,
  firebaseConfig?: any
) => {
  await FirebaseService.instance.remove(dbRef, firebaseConfig);
  for (const item of arr) {
    const snapshot = await FirebaseService.instance.push(dbRef, item);
    item.key = snapshot.key as any;
    const newRef = FirebaseService.instance.ref(
      snapshot.ref.toString(),
      firebaseConfig
    );
    await FirebaseService.instance.update(newRef, item, firebaseConfig);
  }
  if (!!commit && !!mutation) {
    commit(mutation, arr);
  }
};

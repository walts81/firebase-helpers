import {
  DatabaseReference,
  ref,
  push,
  remove,
  update,
} from './firebase-service';

export const initFirebaseArray = async <T extends { key: string }>(
  dbRef: DatabaseReference,
  arr: T[],
  commit?: (mutation: string, data: T[]) => void,
  mutation?: string,
  firebaseConfig?: any
) => {
  await remove(dbRef, firebaseConfig);
  for (const item of arr) {
    const snapshot = await push(dbRef, item);
    item.key = snapshot.key as any;
    const newRef = ref(snapshot.ref.toString(), firebaseConfig);
    await update(newRef, item, firebaseConfig);
  }
  if (!!commit && !!mutation) {
    commit(mutation, arr);
  }
};

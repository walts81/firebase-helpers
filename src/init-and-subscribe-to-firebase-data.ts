import {
  DatabaseReference,
  getPath,
  ref,
  onValue,
  set,
} from './firebase-service';

export const initAndSubscribeToFirebaseData = <T = any>(
  parentRef: DatabaseReference,
  childPath: string,
  defaultValue: T,
  callback?: (val: T) => void,
  commit?: (mutation: string, data: T) => void,
  mutation?: string,
  firebaseConfig?: any
) => {
  const path = getPath(parentRef, childPath);
  const dbRef = ref(path, firebaseConfig);
  return onValue<T>(
    dbRef,
    data => {
      let val = data;
      if (data === undefined) {
        val = defaultValue;
        set(dbRef, defaultValue, firebaseConfig);
      }
      if (!!commit && !!mutation) {
        commit(mutation, val);
      }
      if (!!callback) {
        callback(val);
      }
    },
    undefined,
    firebaseConfig
  );
};

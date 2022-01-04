import { DatabaseReference, onValue, set } from './firebase-service';

export const initAndSubscribeToFirebaseData = <T = any>(
  ref: DatabaseReference,
  defaultValue?: T,
  commit?: (mutation: string, data: T) => void,
  mutation?: string,
  callback?: (val: T) => void,
  firebaseConfig?: any
) => {
  return onValue<T>(
    ref,
    data => {
      let val = data;
      if (data === undefined) {
        val = defaultValue as any;
        if (val != null) set(ref, defaultValue, firebaseConfig);
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

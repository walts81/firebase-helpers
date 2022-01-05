import { onValue, set } from './firebase-service';
import { DatabaseReference, Unsubscribe } from './firebase-types';
import { getArgsToUse } from './args-helper';

function initAndSubscribeToFirebaseData<T = any>(
  ref: DatabaseReference,
  defaultValue?: T,
  firebaseConfig?: any
): Unsubscribe;
function initAndSubscribeToFirebaseData<T = any>(
  ref: DatabaseReference,
  defaultValue: T,
  callback: (val: T) => void,
  firebaseConfig?: any
): Unsubscribe;
function initAndSubscribeToFirebaseData<T = any>(
  ref: DatabaseReference,
  defaultValue: T,
  commit: (mutation: string, data: T) => void,
  mutation: string,
  firebaseConfig?: any
): Unsubscribe;
function initAndSubscribeToFirebaseData<T = any>(
  ref: DatabaseReference,
  defaultValue: T,
  callback?: any,
  mutation?: any,
  firebaseConfig?: any
): Unsubscribe {
  const { mapArrToUse, commitToUse, mutationToUse, configToUse } = getArgsToUse(
    callback,
    mutation,
    firebaseConfig,
    undefined
  );
  return onValue<T>(
    ref,
    data => {
      let val = data;
      if (data === undefined) {
        val = defaultValue as any;
        if (val != null) set(ref, defaultValue, configToUse);
      }

      commitToUse(mutationToUse, val);
      mapArrToUse(val);
    },
    undefined,
    configToUse
  );
}

export { initAndSubscribeToFirebaseData };

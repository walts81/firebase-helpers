import { FirebaseService } from './firebase-service';
import { DatabaseReference, Unsubscribe } from './firebase-types';

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
  callback?: ((val: T) => void) | ((mutation: string, data: T) => void),
  mutation?: string,
  firebaseConfig?: any
): Unsubscribe {
  const config =
    !firebaseConfig && !mutation && !!callback && typeof callback === 'object'
      ? (callback as any)
      : !firebaseConfig && !!mutation && typeof mutation === 'object'
      ? (mutation as any)
      : firebaseConfig;
  return FirebaseService.instance.onValue<T>(
    ref,
    data => {
      let val = data;
      if (data === undefined) {
        val = defaultValue as any;
        if (val != null)
          FirebaseService.instance.set(ref, defaultValue, config);
      }
      if (
        !!callback &&
        typeof callback === 'function' &&
        !!mutation &&
        typeof mutation === 'string'
      ) {
        (callback as any as (m: string, v: T) => void)(mutation, val);
      }
      if (
        !!callback &&
        typeof callback === 'function' &&
        (!mutation || typeof mutation === 'object')
      ) {
        (callback as any as (v: T) => void)(val);
      }
    },
    undefined,
    config
  );
}

export { initAndSubscribeToFirebaseData };

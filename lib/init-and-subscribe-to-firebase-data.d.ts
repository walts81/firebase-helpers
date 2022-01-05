import { DatabaseReference, Unsubscribe } from './firebase-types';
declare function initAndSubscribeToFirebaseData<T = any>(ref: DatabaseReference, defaultValue?: T, firebaseConfig?: any): Unsubscribe;
declare function initAndSubscribeToFirebaseData<T = any>(ref: DatabaseReference, defaultValue: T, callback: (val: T) => void, firebaseConfig?: any): Unsubscribe;
declare function initAndSubscribeToFirebaseData<T = any>(ref: DatabaseReference, defaultValue: T, commit: (mutation: string, data: T) => void, mutation: string, firebaseConfig?: any): Unsubscribe;
export { initAndSubscribeToFirebaseData };

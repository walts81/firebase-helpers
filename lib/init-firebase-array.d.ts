import { DatabaseReference } from './firebase-types';
declare function initFirebaseArray<T extends {
    key: string;
}>(dbRef: DatabaseReference, arr: T[], firebaseConfig?: any): Promise<Array<T>>;
declare function initFirebaseArray<T extends {
    key: string;
}>(dbRef: DatabaseReference, arr: T[], commit: (mutation: string, data: T[]) => void, mutation: string, firebaseConfig?: any): Promise<Array<T>>;
export { initFirebaseArray };

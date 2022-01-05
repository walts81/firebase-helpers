import { DatabaseReference } from './firebase-types';
declare function updateItemsInFirebaseArray<T extends {
    key: string;
}>(parentRef: DatabaseReference, arr: T[], firebaseConfig?: any): Promise<Array<T>>;
declare function updateItemsInFirebaseArray<T extends {
    key: string;
}>(parentRef: DatabaseReference, arr: T[], commit: (mutation: string, data: T[]) => void, mutation: string, firebaseConfig?: any): Promise<Array<T>>;
export { updateItemsInFirebaseArray };

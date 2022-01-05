import { DatabaseReference } from './firebase-types';
declare function updateItemInFirebaseArray<T extends {
    key: string;
}>(parentRef: DatabaseReference, item: T, arr: T[], firebaseConfig?: any): Promise<Array<T>>;
declare function updateItemInFirebaseArray<T extends {
    key: string;
}>(parentRef: DatabaseReference, item: T, arr: T[], mappArr: (arr: T[]) => T[], firebaseConfig?: any): Promise<Array<T>>;
declare function updateItemInFirebaseArray<T extends {
    key: string;
}>(parentRef: DatabaseReference, item: T, arr: T[], commit: (mutation: string, data: T[]) => void, mutation: string, firebaseConfig?: any): Promise<Array<T>>;
declare function updateItemInFirebaseArray<T extends {
    key: string;
}>(parentRef: DatabaseReference, item: T, arr: T[], mappArr: (arr: T[]) => T[], commit: (mutation: string, data: T[]) => void, mutation: string, firebaseConfig?: any): Promise<Array<T>>;
export { updateItemInFirebaseArray };

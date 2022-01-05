import { Query } from './firebase-types';
declare function getFirebaseArray<T>(query: Query, firebaseConfig?: any): Promise<Array<T>>;
declare function getFirebaseArray<T>(query: Query, mapArray: (arr: any[]) => T[], firebaseConfig?: any): Promise<Array<T>>;
declare function getFirebaseArray<T>(query: Query, commit: (mutation: string, data: T[]) => void, mutation: string, firebaseConfig?: any): Promise<Array<T>>;
declare function getFirebaseArray<T>(query: Query, mapArray: (arr: any[]) => T[], commit: (mutation: string, data: T[]) => void, mutation: string, firebaseConfig?: any): Promise<Array<T>>;
export { getFirebaseArray };

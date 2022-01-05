import { Query } from './firebase-types';
export declare const onArrayOnce: <T = any>(query: Query, firebaseConfig?: any) => Promise<T[]>;
export declare const onValueOnce: <T = any>(query: Query, firebaseConfig?: any) => Promise<T>;

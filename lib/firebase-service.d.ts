import * as db from 'firebase/database';
declare type Query = db.Query;
declare type DatabaseReference = db.DatabaseReference;
declare type DataSnapshot = db.DataSnapshot;
export declare const init: (firebaseConfig: any) => void;
export declare const getPath: (parentRef: DatabaseReference, childPath: string) => string;
export declare const ref: (path: string, firebaseConfig?: any) => db.DatabaseReference;
export declare const onValue: <T>(query: Query, callback: (data: T) => void, defaultValue?: T | undefined, firebaseConfig?: any) => db.Unsubscribe;
export declare const onChildAdded: <T>(query: Query, callback: (data: T) => void, defaultValue?: T | undefined, firebaseConfig?: any) => db.Unsubscribe;
export declare const onChildChanged: <T>(query: Query, callback: (data: T) => void, defaultValue?: T | undefined, firebaseConfig?: any) => db.Unsubscribe;
export declare const push: <T>(ref: DatabaseReference, data: T, firebaseConfig?: any) => Promise<DatabaseReference>;
export declare const remove: (ref: DatabaseReference, firebaseConfig?: any) => Promise<void>;
export declare const update: <T extends object>(ref: DatabaseReference, data: T, firebaseConfig?: any) => Promise<void>;
export declare const get: <T>(query: Query, defaultValue: T, firebaseConfig?: any) => Promise<T>;
export declare const set: <T>(ref: DatabaseReference, data: T, firebaseConfig?: any) => Promise<void>;
export declare const onArrayOnce: <T = any>(query: Query, firebaseConfig?: any) => Promise<T[]>;
export declare const onValueOnce: <T = any>(query: Query, firebaseConfig?: any) => Promise<T>;
export { Query, DatabaseReference, DataSnapshot };

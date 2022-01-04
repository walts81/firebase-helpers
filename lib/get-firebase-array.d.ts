import { Query } from './firebase-service';
export declare const getFirebaseArray: <T>(query: Query, mapArray?: ((a: any[]) => T[]) | undefined, commit?: ((mutation: string, data: T[]) => void) | undefined, mutation?: string | undefined, firebaseConfig?: any) => Promise<T[]>;

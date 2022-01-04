import { DatabaseReference } from './firebase-service';
export declare const updateItemInFirebaseArray: <T extends {
    key: string;
}>(parentRef: DatabaseReference, item: T, arr: T[], mapArr?: ((a: T[]) => T[]) | undefined, commit?: ((mutation: string, data: T[]) => void) | undefined, mutation?: string | undefined, firebaseConfig?: any) => Promise<void>;

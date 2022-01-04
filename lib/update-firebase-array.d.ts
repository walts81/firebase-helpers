import { DatabaseReference } from './firebase-service';
export declare const updateFirebaseArray: <T extends {
    key: string;
}>(parentRef: DatabaseReference, arr: T[], commit?: ((mutation: string, data: T[]) => void) | undefined, mutation?: string | undefined, firebaseConfig?: any) => Promise<void>;

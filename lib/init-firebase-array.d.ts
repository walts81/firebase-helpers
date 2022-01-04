import { DatabaseReference } from './firebase-service';
export declare const initFirebaseArray: <T extends {
    key: string;
}>(dbRef: DatabaseReference, arr: T[], commit?: ((mutation: string, data: T[]) => void) | undefined, mutation?: string | undefined, firebaseConfig?: any) => Promise<void>;

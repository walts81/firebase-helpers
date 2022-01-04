import { DatabaseReference } from './firebase-service';
export declare const initAndSubscribeToFirebaseData: <T = any>(parentRef: DatabaseReference, childPath: string, defaultValue: T, callback?: ((val: T) => void) | undefined, commit?: ((mutation: string, data: T) => void) | undefined, mutation?: string | undefined, firebaseConfig?: any) => import("@firebase/database").Unsubscribe;

import { FirebaseService } from './firebase-service';
import { DataSnapshot, Query, Unsubscribe } from './firebase-types';

const once = (
  query: Query,
  action: (query: Query, callback: (s: DataSnapshot) => void) => Unsubscribe
) => {
  return new Promise<DataSnapshot>(resolve => {
    let unsub: () => void = null as any;
    unsub = action(query, snapshot => {
      if (!!unsub) unsub();
      unsub = null as any;
      resolve(snapshot);
    });
  });
};

export const onArrayOnce = <T = any>(query: Query, firebaseConfig?: any) => {
  const svc = FirebaseService.instance;
  svc.init(firebaseConfig);
  return new Promise<Array<T>>(resolve => {
    once(query, svc.onValue).then(snapshot => {
      const data: T[] = [];
      if (snapshot.exists()) {
        snapshot.forEach(x => {
          data.push(x.val());
        });
      }
      resolve(data);
    });
  });
};

export const onValueOnce = <T = any>(query: Query, firebaseConfig?: any) => {
  const svc = FirebaseService.instance;
  svc.init(firebaseConfig);
  return new Promise<T>(resolve => {
    once(query, svc.onValue).then(snapshot => {
      if (snapshot.exists()) {
        resolve(snapshot.val());
      } else {
        resolve(undefined as any);
      }
    });
  });
};

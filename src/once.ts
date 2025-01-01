import { isArray } from './args-helper';
import * as service from './firebase-service';
import * as db from './firebase-wrappers';
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

const initWithNoError = (config?: any) => {
  if (!!config) {
    service.init(config);
  }
};

export const onArrayOnce = async <T = any>(
  query: Query,
  firebaseConfig?: any
) => {
  initWithNoError(firebaseConfig);
  const snapshot = await once(query, db.onValue);
  const data: T[] = [];
  if (snapshot.exists()) {
    snapshot.forEach(x => {
      const data = x.val();
      if (typeof data === 'object' && !isArray(data)) {
        data.push({ ...data, key: x.key });
      } else {
        data.push(data);
      }
    });
  }
  return data;
};

export const onValueOnce = async <T = any>(
  query: Query,
  firebaseConfig?: any
): Promise<T> => {
  initWithNoError(firebaseConfig);
  const snapshot = await once(query, db.onValue);
  if (snapshot.exists()) {
    const data = snapshot.val();
    if (typeof data === 'object' && !isArray(data)) {
      return { ...data, key: snapshot.key };
    }
    return data;
  }
  return undefined as any;
};

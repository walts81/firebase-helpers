import { initializeApp, FirebaseApp } from 'firebase/app';
import * as db from 'firebase/database';

let app: FirebaseApp = null as any;
let database: db.Database = null as any;

type Query = db.Query;
type DatabaseReference = db.DatabaseReference;
type DataSnapshot = db.DataSnapshot;

export const init = (firebaseConfig: any) => {
  if (!app && !!firebaseConfig) {
    app = initializeApp(firebaseConfig);
    database = db.getDatabase(app);
  }
};

export const getPath = (parentRef: DatabaseReference, childPath: string) => {
  let result = '';
  const parentPath = parentRef.toString();
  result += parentPath;
  if (!result.endsWith('/')) result += '/';
  result += childPath;
  return result;
};

export const ref = (path: string, firebaseConfig?: any) => {
  init(firebaseConfig);
  return db.ref(database, path);
};

export const onValue = <T>(
  query: Query,
  callback: (data: T) => void,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  init(firebaseConfig);
  return db.onValue(query, snapshot => {
    const val = snapshot.val();
    if (!!val || val === 0) callback(val);
    else callback(defaultValue as any);
  });
};

export const onChildAdded = <T>(
  query: Query,
  callback: (data: T) => void,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  init(firebaseConfig);
  return db.onChildAdded(query, snapshot => {
    let val = snapshot.val();
    if (!!val || val === 0) {
      if (typeof val === 'object') {
        val = { ...val, key: snapshot.key };
      }
      callback(val);
    } else callback(defaultValue as any);
  });
};

export const onChildChanged = <T>(
  query: Query,
  callback: (data: T) => void,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  init(firebaseConfig);
  return db.onChildChanged(query, snapshot => {
    const val = snapshot.val();
    if (!!val || val === 0) callback(val);
    else callback(defaultValue as any);
  });
};

export const push = <T>(
  ref: DatabaseReference,
  data: T,
  firebaseConfig?: any
): Promise<DatabaseReference> => {
  return new Promise<DatabaseReference>(resolve => {
    init(firebaseConfig);
    db.push(ref, data).then(x => resolve(x));
  });
};

export const remove = (ref: DatabaseReference, firebaseConfig?: any) => {
  init(firebaseConfig);
  return db.remove(ref);
};

export const update = <T extends object>(
  ref: DatabaseReference,
  data: T,
  firebaseConfig?: any
) => {
  init(firebaseConfig);
  return db.update(ref, data);
};

export const get = <T>(query: Query, defaultValue: T, firebaseConfig?: any) => {
  return new Promise<T>(resolve => {
    init(firebaseConfig);
    db.get(query).then(snapshot => {
      const val = snapshot.val();
      resolve(val || defaultValue);
    });
  });
};

export const set = <T>(
  ref: DatabaseReference,
  data: T,
  firebaseConfig?: any
) => {
  init(firebaseConfig);
  return db.set(ref, data);
};

const once = (
  query: Query,
  action: (query: Query, callback: (s: DataSnapshot) => void) => db.Unsubscribe
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
  return new Promise<Array<T>>(resolve => {
    init(firebaseConfig);
    once(query, db.onValue).then(snapshot => {
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
  return new Promise<T>(resolve => {
    init(firebaseConfig);
    once(query, db.onValue).then(snapshot => {
      if (snapshot.exists()) {
        resolve(snapshot.val());
      } else {
        resolve(undefined as any);
      }
    });
  });
};

export { Query, DatabaseReference, DataSnapshot };

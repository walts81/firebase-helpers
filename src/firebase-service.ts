import * as db from './firebase-wrappers';
import {
  Database,
  DatabaseReference,
  FirebaseApp,
  Query,
} from './firebase-types';

let app: FirebaseApp = null as any;
let database: Database = null as any;

export const init = (firebaseConfig: any) => {
  if (!app && !!firebaseConfig) {
    app = db.initializeApp(firebaseConfig);
    database = db.getDatabase(app);
  }
};

export const getPath = (parentRef: DatabaseReference, childPath: string) => {
  let result = '';
  const parentPath = parentRef.toString();
  result += parentPath;
  if (!result.endsWith('/') && !childPath.startsWith('/')) result += '/';
  result += childPath;
  return result;
};

export const ref = (path: string, firebaseConfig?: any) => {
  init(firebaseConfig);
  return db.ref(database, path);
};

export const onValue = <T = any>(
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

export const onChildAdded = <T = any>(
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

export const onChildChanged = <T = any>(
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

export const push = <T = any>(
  ref: DatabaseReference,
  data: T,
  firebaseConfig?: any
) => {
  init(firebaseConfig);
  return db.push(ref, data).then(x => x);
};

export const remove = (ref: DatabaseReference, firebaseConfig?: any) => {
  init(firebaseConfig);
  return db.remove(ref);
};

export const update = <T extends object = any>(
  ref: DatabaseReference,
  data: T,
  firebaseConfig?: any
) => {
  init(firebaseConfig);
  return db.update(ref, data);
};

export const get = async <T = any>(
  query: Query,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  init(firebaseConfig);
  const snapshot = await db.get(query);
  const val = snapshot.val();
  return val || defaultValue;
};

export const set = <T = any>(
  ref: DatabaseReference,
  data: T,
  firebaseConfig?: any
) => {
  init(firebaseConfig);
  return db.set(ref, data);
};

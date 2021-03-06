import * as db from './firebase-wrappers';
import {
  Database,
  DatabaseReference,
  FirebaseApp,
  Query,
} from './firebase-types';

let app: FirebaseApp = null as any;
let database: Database = null as any;

export function init(app: FirebaseApp): {
  app: FirebaseApp;
  database: Database;
};
export function init(config: any): { app: FirebaseApp; database: Database };
export function init(appOrConfig: any): {
  app: FirebaseApp;
  database: Database;
} {
  if (!app && !appOrConfig)
    throw new Error(
      'Must call with either a valid firebase config or an already inited firebase app'
    );

  if (!app && !!appOrConfig) {
    const isConfig = !!appOrConfig.apiKey && !!appOrConfig.appId;
    app = isConfig ? db.initializeApp(appOrConfig) : appOrConfig;
    database = db.getDatabase(app);
  }
  return { app, database };
}

const initWithNoError = (config: any) => {
  if (!!config) {
    init(config);
  }
};

export const closeApp = () => {
  app = null as any;
  database = null as any;
};

const getRootPath = (ref: DatabaseReference) => {
  let path = ref.key;
  let parent = ref.parent;
  while (!!parent && !!parent.key) {
    path = parent.key + '/' + path;
    parent = parent.parent;
  }
  return path;
};

export const getPath = (parentRef: DatabaseReference, childPath: string) => {
  let result = '';
  const parentPath = getRootPath(parentRef);
  result += parentPath;
  if (!result.endsWith('/') && !childPath.startsWith('/')) result += '/';
  result += childPath;
  return result;
};

export const ref = (path: string, firebaseConfig?: any) => {
  initWithNoError(firebaseConfig);
  return db.ref(database, path);
};

export const onValue = <T = any>(
  query: Query,
  callback: (data: T) => void,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  initWithNoError(firebaseConfig);
  return db.onValue(query, snapshot => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      if (!!val || val === 0) callback(val);
      else callback(defaultValue as any);
    } else {
      callback(defaultValue as any);
    }
  });
};

export const onChildAdded = <T = any>(
  query: Query,
  callback: (data: T) => void,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  initWithNoError(firebaseConfig);
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

const onChildAddedOrChanged = <T = any>(
  getArr: () => T[],
  commit: (mutation: string, data: T[]) => void,
  mutation: string,
  mapData?: (data: any) => T
) => {
  return (data: T) => {
    const mapDataToUse = !!mapData
      ? mapData
      : x => (!!x && typeof x === 'object' ? { ...x } : x);
    const arr = getArr().map(mapDataToUse);
    const dataToUse = mapDataToUse(data);
    let ix = -1;
    if (typeof data === 'object') {
      ix = arr.findIndex(x => x.key === dataToUse.key);
    } else {
      ix = arr.findIndex(x => x === dataToUse);
    }
    if (ix < 0) arr.push(dataToUse);
    else arr.splice(ix, 1, dataToUse);
    commit(mutation, arr);
  };
};

export const onChildAddedWithCommit = <T = any>(
  query: Query,
  getArr: () => T[],
  commit: (mutation: string, data: T[]) => void,
  mutation: string,
  mapData?: (data: any) => T,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  return onChildAdded<T>(
    query,
    x => onChildAddedOrChanged(getArr, commit, mutation, mapData)(x),
    defaultValue,
    firebaseConfig
  );
};

export const onChildChangedWithCommit = <T = any>(
  query: Query,
  getArr: () => T[],
  commit: (mutation: string, data: T[]) => void,
  mutation: string,
  mapData?: (data: any) => T,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  return onChildChanged<T>(
    query,
    x => onChildAddedOrChanged(getArr, commit, mutation, mapData)(x),
    defaultValue,
    firebaseConfig
  );
};

export const onChildChanged = <T = any>(
  query: Query,
  callback: (data: T) => void,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  initWithNoError(firebaseConfig);
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
  initWithNoError(firebaseConfig);
  return db.push(ref, data).then(x => x);
};

export const remove = (ref: DatabaseReference, firebaseConfig?: any) => {
  initWithNoError(firebaseConfig);
  return db.remove(ref);
};

export const update = <T extends object = any>(
  ref: DatabaseReference,
  data: T,
  firebaseConfig?: any
) => {
  initWithNoError(firebaseConfig);
  return db.update(ref, data);
};

export const get = async <T = any>(
  query: Query,
  defaultValue?: T,
  firebaseConfig?: any
) => {
  initWithNoError(firebaseConfig);
  const snapshot = await db.get(query);
  const val = snapshot.val();
  return val || defaultValue;
};

export const set = <T = any>(
  ref: DatabaseReference,
  data: T,
  firebaseConfig?: any
) => {
  initWithNoError(firebaseConfig);
  return db.set(ref, data);
};

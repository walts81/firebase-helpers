import * as db from './firebase-wrappers';
import {
  Database,
  DatabaseReference,
  FirebaseApp,
  Query,
} from './firebase-types';

let app: FirebaseApp = null as any;
let database: Database = null as any;

let service: FirebaseService;

export class FirebaseService {
  private constructor() {}

  static get instance(): FirebaseService {
    if (!service) service = new FirebaseService();
    return service;
  }

  init(firebaseConfig: any) {
    if (!app && !!firebaseConfig) {
      app = db.initializeApp(firebaseConfig);
      database = db.getDatabase(app);
    }
  }

  getPath(parentRef: DatabaseReference, childPath: string) {
    let result = '';
    const parentPath = parentRef.toString();
    result += parentPath;
    if (!result.endsWith('/') && !childPath.startsWith('/')) result += '/';
    result += childPath;
    return result;
  }

  ref(path: string, firebaseConfig?: any) {
    this.init(firebaseConfig);
    return db.ref(database, path);
  }

  onValue<T = any>(
    query: Query,
    callback: (data: T) => void,
    defaultValue?: T,
    firebaseConfig?: any
  ) {
    this.init(firebaseConfig);
    return db.onValue(query, snapshot => {
      const val = snapshot.val();
      if (!!val || val === 0) callback(val);
      else callback(defaultValue as any);
    });
  }

  onChildAdded<T = any>(
    query: Query,
    callback: (data: T) => void,
    defaultValue?: T,
    firebaseConfig?: any
  ) {
    this.init(firebaseConfig);
    return db.onChildAdded(query, snapshot => {
      let val = snapshot.val();
      if (!!val || val === 0) {
        if (typeof val === 'object') {
          val = { ...val, key: snapshot.key };
        }
        callback(val);
      } else callback(defaultValue as any);
    });
  }

  onChildChanged<T = any>(
    query: Query,
    callback: (data: T) => void,
    defaultValue?: T,
    firebaseConfig?: any
  ) {
    this.init(firebaseConfig);
    return db.onChildChanged(query, snapshot => {
      const val = snapshot.val();
      if (!!val || val === 0) callback(val);
      else callback(defaultValue as any);
    });
  }

  push<T = any>(
    ref: DatabaseReference,
    data: T,
    firebaseConfig?: any
  ): Promise<DatabaseReference> {
    this.init(firebaseConfig);
    return db.push(ref, data).then(x => x);
  }

  remove(ref: DatabaseReference, firebaseConfig?: any) {
    this.init(firebaseConfig);
    return db.remove(ref);
  }

  update<T extends object = any>(
    ref: DatabaseReference,
    data: T,
    firebaseConfig?: any
  ) {
    this.init(firebaseConfig);
    return db.update(ref, data);
  }

  async get<T = any>(query: Query, defaultValue?: T, firebaseConfig?: any) {
    this.init(firebaseConfig);
    const snapshot = await db.get(query);
    const val = snapshot.val();
    return val || defaultValue;
  }

  set<T = any>(ref: DatabaseReference, data: T, firebaseConfig?: any) {
    this.init(firebaseConfig);
    return db.set(ref, data);
  }
}

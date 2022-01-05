import * as db from 'firebase/database';
import * as app from 'firebase/app';

export const get = db.get;
export const onChildAdded = db.onChildAdded;
export const onChildChanged = db.onChildChanged;
export const onValue = db.onValue;
export const push = db.push;
export const remove = db.remove;
export const ref = db.ref;
export const set = db.set;
export const update = db.update;
export const getDatabase = db.getDatabase;
export const initializeApp = app.initializeApp;

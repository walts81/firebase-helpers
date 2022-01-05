import * as db from 'firebase/database';
import * as app from 'firebase/app';

type Database = db.Database;
type DatabaseReference = db.DatabaseReference;
type DataSnapshot = db.DataSnapshot;
type Query = db.Query;
type Unsubscribe = db.Unsubscribe;
type FirebaseApp = app.FirebaseApp;

export {
  Database,
  DatabaseReference,
  DataSnapshot,
  FirebaseApp,
  Query,
  Unsubscribe,
};

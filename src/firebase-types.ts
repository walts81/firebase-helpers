import * as db from 'firebase/database';
import * as app from 'firebase/app';

type Database = db.Database;
type DatabaseReference = db.DatabaseReference;
type DataSnapshot = db.DataSnapshot;
type Query = db.Query;
type Unsubscribe = db.Unsubscribe;
type FirebaseApp = app.FirebaseApp;
type QueryConstraint = db.QueryConstraint;
type QueryConstraintType = db.QueryConstraintType;

export {
  Database,
  DatabaseReference,
  DataSnapshot,
  FirebaseApp,
  Query,
  QueryConstraint,
  QueryConstraintType,
  Unsubscribe,
};

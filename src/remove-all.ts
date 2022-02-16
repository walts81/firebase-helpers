import { Query, QueryConstraint } from './firebase-types';
import * as db from './firebase-wrappers';
import { init } from './firebase-service';

export const removeAll = async (
  query: Query,
  ...constraints: QueryConstraint[]
) => {
  const q = db.query(query, ...constraints);
  const refUrls: string[] = [];
  (await db.get(q)).forEach(snapshot => {
    if (snapshot.exists()) {
      refUrls.push(snapshot.ref.toString() as any);
    }
  });
  const fDb = init({} as any);
  for (const url of refUrls) {
    await db.remove(db.refFromURL(fDb.database, url));
  }
};

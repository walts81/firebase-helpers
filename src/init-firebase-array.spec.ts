import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { initFirebaseArray } from './init-firebase-array';
import * as service from './firebase-service';

describe('init-firebase-array should', () => {
  const snapshot = { key: 'test-key' };
  const dbRef: any = { key: 'parentPath' };
  const updateRef: any = { key: 'newRef' };
  const newData: any = { data: 'test' };
  it('pass config', async () => {
    const stub = sinon.stub(service, 'remove');
    const config = { key: 'test' };
    await initFirebaseArray(dbRef, [], config);
    expect(stub.calledOnceWithExactly(dbRef, config)).to.be.true;
    stub.restore();
  });
  it('remove existing array', async () => {
    const stub = sinon.stub(service, 'remove');
    await initFirebaseArray(dbRef, []);
    expect(stub.calledOnceWithExactly(dbRef, undefined)).to.be.true;
    stub.restore();
  });
  it('update item with key after push', async () => {
    const removeStub = sinon.stub(service, 'remove');
    const pushStub = sinon.stub(service, 'push').callsFake((r, d) => {
      return Promise.resolve(snapshot as any);
    });
    const refStub = sinon.stub(service, 'ref').returns(updateRef);
    const updateStub = sinon.stub(service, 'update').returns(Promise.resolve());
    const allStubs = [removeStub, pushStub, refStub, updateStub];
    const arr = [newData];
    await initFirebaseArray(dbRef, arr);
    expect(pushStub.calledOnceWithExactly(dbRef, arr[0])).to.be.true;
    expect(
      refStub.calledOnceWithExactly(`${dbRef.key}/${snapshot.key}`, undefined)
    ).to.be.true;
    expect(
      updateStub.calledOnceWith(
        updateRef,
        { ...newData, key: snapshot.key },
        undefined
      )
    ).to.be.true;
    allStubs.forEach(x => x.restore());
  });
  it('commit mutation', async () => {
    const removeStub = sinon.stub(service, 'remove');
    const pushStub = sinon.stub(service, 'push').callsFake((r, d) => {
      return Promise.resolve(snapshot as any);
    });
    const refStub = sinon.stub(service, 'ref').returns(updateRef);
    const updateStub = sinon.stub(service, 'update').returns(Promise.resolve());
    const allStubs = [removeStub, pushStub, refStub, updateStub];
    const arr = [newData];
    const spy = sinon.fake();
    await initFirebaseArray(dbRef, arr, spy, 'test-mutation');
    expect(
      spy.calledOnceWith(
        'test-mutation',
        arr.map(x => ({ ...x, key: snapshot.key }))
      )
    ).to.be.true;
    allStubs.forEach(x => x.restore());
  });
});

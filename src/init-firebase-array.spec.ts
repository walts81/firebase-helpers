import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { initFirebaseArray } from './init-firebase-array';
import * as service from './firebase-service';

describe('init-firebase-array should', () => {
  it('pass config', async () => {
    const stub = sinon.stub(service, 'remove');
    const config = { key: 'test' };
    await initFirebaseArray(null as any, [], config);
    expect(stub.calledOnceWithExactly(null as any, config)).to.be.true;
    stub.restore();
  });
  it('remove existing array', async () => {
    const stub = sinon.stub(service, 'remove');
    await initFirebaseArray(null as any, []);
    expect(stub.calledOnceWithExactly(null as any, undefined)).to.be.true;
    stub.restore();
  });
  it('update item with key after push', async () => {
    const removeStub = sinon.stub(service, 'remove');
    const snapshot = { ref: 'test/path', key: 'test-key' };
    const pushStub = sinon.stub(service, 'push').callsFake((r, d) => {
      return Promise.resolve(snapshot as any);
    });
    const refStub = sinon.stub(service, 'ref').returns('newRef' as any);
    const updateStub = sinon.stub(service, 'update').returns(Promise.resolve());
    const allStubs = [removeStub, pushStub, refStub, updateStub];
    const arr = [{ key: '', data: 'test' }];
    await initFirebaseArray(null as any, arr);
    expect(pushStub.calledOnceWithExactly(null as any, arr[0])).to.be.true;
    expect(refStub.calledOnceWithExactly(snapshot.ref, undefined)).to.be.true;
    expect(
      updateStub.calledOnceWith(
        'newRef' as any,
        { key: 'test-key', data: 'test' },
        undefined
      )
    ).to.be.true;
    allStubs.forEach(x => x.restore());
  });
  it('commit mutation', async () => {
    const removeStub = sinon.stub(service, 'remove');
    const snapshot = { ref: 'test/path', key: 'test-key' };
    const pushStub = sinon.stub(service, 'push').callsFake((r, d) => {
      return Promise.resolve(snapshot as any);
    });
    const refStub = sinon.stub(service, 'ref').returns('newRef' as any);
    const updateStub = sinon.stub(service, 'update').returns(Promise.resolve());
    const allStubs = [removeStub, pushStub, refStub, updateStub];
    const arr = [{ key: '', data: 'test' }];
    const spy = sinon.fake();
    await initFirebaseArray(null as any, arr, spy, 'test-mutation');
    expect(spy.calledOnceWithExactly('test-mutation', arr)).to.be.true;
    allStubs.forEach(x => x.restore());
  });
});

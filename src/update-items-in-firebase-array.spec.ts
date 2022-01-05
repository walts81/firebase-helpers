import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import * as service from './firebase-service';
import { updateItemsInFirebaseArray } from './update-items-in-firebase-array';

describe('update-items-in-firebase-array should', () => {
  it('pass config', async () => {
    const stub = sinon.stub(service, 'ref').returns('refPath' as any);
    const stubs = [
      sinon.stub(service, 'getPath').returns('path'),
      stub,
      sinon.stub(service, 'update').returns(Promise.resolve()),
    ];
    const config = { key: 'test' };
    await updateItemsInFirebaseArray(
      null as any,
      [{ key: 'test-key', data: 'test-data' }],
      config
    );
    expect(stub.calledOnceWithExactly('path' as any, config)).to.be.true;
    stubs.forEach(x => x.restore());
  });
  it('update each item', async () => {
    const arr = [
      { key: 'test-key-1', data: 'test-1' },
      { key: 'test-key-2', data: 'test-2' },
    ];
    const pathStub = sinon.stub(service, 'getPath');
    pathStub.withArgs('parentPath' as any, 'test-key-1').returns('path1');
    pathStub.withArgs('parentPath' as any, 'test-key-2').returns('path2');
    const refStub = sinon.stub(service, 'ref');
    refStub.withArgs('path1').returns('ref1Path' as any);
    refStub.withArgs('path2').returns('ref2Path' as any);
    const updateStub = sinon.stub(service, 'update').returns(Promise.resolve());
    const allStubs = [pathStub, refStub, updateStub];
    await updateItemsInFirebaseArray('parentPath' as any, arr);
    expect(pathStub.calledWithExactly('parentPath' as any, 'test-key-1')).to.be
      .true;
    expect(pathStub.calledWithExactly('parentPath' as any, 'test-key-2')).to.be
      .true;
    expect(refStub.calledWithExactly('path1' as any, undefined)).to.be.true;
    expect(refStub.calledWithExactly('path2' as any, undefined)).to.be.true;
    expect(updateStub.calledWithExactly('ref1Path' as any, arr[0], undefined))
      .to.be.true;
    expect(updateStub.calledWithExactly('ref2Path' as any, arr[1], undefined))
      .to.be.true;
    allStubs.forEach(x => x.restore());
  });
  it('commit mutation', async () => {
    const arr = [
      { key: 'test-key-1', data: 'test-1' },
      { key: 'test-key-2', data: 'test-2' },
      { key: '', data: 'test-3' },
    ];
    const stubs = [
      sinon.stub(service, 'getPath').returns('path'),
      sinon.stub(service, 'ref').returns('refPath' as any),
      sinon.stub(service, 'update').returns(Promise.resolve()),
    ];
    const spy = sinon.fake();
    await updateItemsInFirebaseArray(null as any, arr, spy, 'test-mutation');
    expect(spy.calledWith('test-mutation', arr)).to.be.true;
    stubs.forEach(x => x.restore());
  });
});

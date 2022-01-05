import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import * as service from './firebase-service';
import { DatabaseReference } from './firebase-types';
import { updateItemInFirebaseArray } from './update-item-in-firebase-array';

describe('update-item-in-firebase-array should', () => {
  const dbRef: DatabaseReference = { key: 'parentPath' } as any;
  const updatedRef: any = { key: 'refPath' };
  const dataNoKey: any = { data: 'test' };
  const dataWithKey: any = { key: 'test-key', data: 'test' };
  const updatedData: any = { key: dataWithKey.key, data: 'new-data' };
  it('not update when no key provided', async () => {
    const arr = [dataNoKey];
    const refStub = sinon.stub(service, 'ref').returns(updatedRef);
    const updateStub = sinon.stub(service, 'update').returns(Promise.resolve());
    await updateItemInFirebaseArray(dbRef, arr[0] as any, arr);
    expect(refStub.called).to.be.false;
    expect(updateStub.called).to.be.false;
    refStub.restore();
    updateStub.restore();
  });
  it('update when key is provided', async () => {
    const arr = [dataWithKey];
    const refStub = sinon.stub(service, 'ref').returns(updatedRef);
    const updateStub = sinon.stub(service, 'update').returns(Promise.resolve());
    const result = await updateItemInFirebaseArray(dbRef, updatedData, arr);
    expect(refStub.calledOnceWithExactly('parentPath/test-key', undefined)).to
      .be.true;
    expect(updateStub.calledOnceWithExactly(updatedRef, updatedData, undefined))
      .to.be.true;
    expect(result).to.eql([updatedData]);
    refStub.restore();
    updateStub.restore();
  });
  it('map array', async () => {
    const arr = [{ key: 'test-key', data: 'test' }];
    const spy = sinon.fake.returns(arr);
    await updateItemInFirebaseArray(
      null as any,
      { data: 'new-data' } as any,
      arr,
      spy
    );
    expect(spy.calledOnceWithExactly(arr)).to.be.true;
  });
  it('commit mutation when found in array', async () => {
    const spy = sinon.fake();
    const arr = [{ key: 'test-key', data: 'test' }];
    const newData = { key: 'test-key', data: 'test' };
    const stubs = [
      sinon.stub(service, 'getPath').returns('path' as any),
      sinon.stub(service, 'ref').returns('refPath' as any),
      sinon.stub(service, 'update').returns(Promise.resolve()),
    ];
    const result = await updateItemInFirebaseArray(
      null as any,
      newData,
      arr,
      spy,
      'test-mutation'
    );
    expect(spy.calledOnceWith('test-mutation', [newData])).to.be.true;
    expect(result).to.eql([newData]);
    stubs.forEach(x => x.restore());
  });
  it('not commit mutation when not found in array', async () => {
    const spy = sinon.fake();
    const arr = [{ key: 'test-key', data: 'test' }];
    const newData = { key: 'test-key-different', data: 'test' };
    const stubs = [
      sinon.stub(service, 'getPath').returns('path' as any),
      sinon.stub(service, 'ref').returns('refPath' as any),
      sinon.stub(service, 'update').returns(Promise.resolve()),
    ];
    const result = await updateItemInFirebaseArray(
      null as any,
      newData,
      arr,
      spy,
      'test-mutation'
    );
    expect(spy.calledOnceWith('test-mutation', [newData])).to.be.false;
    expect(result).to.eql(arr);
    stubs.forEach(x => x.restore());
  });
});

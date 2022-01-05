import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import * as service from './once';
import { getFirebaseArray } from './get-firebase-array';
import { Query } from './firebase-types';

describe('get-firebase-array should', () => {
  it('use onArrayOnce', async () => {
    const stub = sinon.stub(service, 'onArrayOnce').resolves([]);
    const ref: Query = null as any;
    await getFirebaseArray(ref);
    expect(stub.calledOnceWithExactly(ref, undefined)).to.be.true;
    stub.restore();
  });
  it('map array', async () => {
    const arr = [{ data: 'test' }];
    const stub = sinon.stub(service, 'onArrayOnce').resolves(arr);
    const ref: Query = null as any;
    const spy = sinon.fake();
    await getFirebaseArray(ref, spy);
    expect(spy.calledOnceWithExactly(arr)).to.be.true;
    stub.restore();
  });
  it('commit mutation', async () => {
    const arr = [{ data: 'test' }];
    const stub = sinon.stub(service, 'onArrayOnce').resolves(arr);
    const ref: Query = null as any;
    const spy = sinon.fake();
    await getFirebaseArray(ref, spy, 'test-mutation');
    expect(spy.calledOnceWithExactly('test-mutation', arr)).to.be.true;
    stub.restore();
  });
});

import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import * as service from './firebase-service';
import { onArrayOnce, onValueOnce } from './once';

describe('onArrayOnce should', () => {
  it('call init', async () => {
    const snapshot = { exists: () => false };
    const onValueStub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      c(snapshot);
      return sinon.fake();
    });
    const initStub = sinon.stub(service, 'init');
    const config = { key: 'test' };
    await onArrayOnce(null as any, config);
    expect(initStub.calledOnceWithExactly(config)).to.be.true;
    onValueStub.restore();
    initStub.restore();
  });
  it('call onValue and unsubscribe', async () => {
    const unsubscribeSpy = sinon.fake();
    const snapshot = { exists: () => false };
    let callback: any = null;
    const stub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      callback = c;
      return unsubscribeSpy;
    });
    const promise = onArrayOnce(null as any);
    setTimeout(() => callback(snapshot), 10);
    await promise;
    expect(stub.calledOnce).to.be.true;
    expect(unsubscribeSpy.calledOnce).to.be.true;
    stub.restore();
  });
  it('return empty array when not exists', async () => {
    const snapshot = { exists: () => false };
    const stub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      c(snapshot);
      return sinon.fake();
    });
    const result = await onArrayOnce(null as any);
    expect(result).to.eql([]);
    stub.restore();
  });
  it('return array when exists', async () => {
    const obj1 = { data: 'test-1' };
    const obj2 = { data: 'test-2' };
    const arr = [{ val: () => obj1 }, { val: () => obj2 }];
    const snapshot = { exists: () => true, forEach: x => arr.forEach(x) };
    const stub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      c(snapshot);
      return sinon.fake();
    });
    const result = await onArrayOnce(null as any);
    expect(result).to.eql([obj1, obj2]);
    stub.restore();
  });
});

describe('onValueOnce should', () => {
  it('call init', async () => {
    const snapshot = { exists: () => false };
    const onValueStub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      c(snapshot);
      return sinon.fake();
    });
    const initStub = sinon.stub(service, 'init');
    const config = { key: 'test' };
    await onValueOnce(null as any, config);
    expect(initStub.calledOnceWithExactly(config)).to.be.true;
    onValueStub.restore();
    initStub.restore();
  });
  it('call onValue and unsubscribe', async () => {
    const unsubscribeSpy = sinon.fake();
    const snapshot = { exists: () => false };
    let callback: any = null;
    const stub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      callback = c;
      return unsubscribeSpy;
    });
    const promise = onValueOnce(null as any);
    setTimeout(() => callback(snapshot), 10);
    await promise;
    expect(stub.calledOnce).to.be.true;
    expect(unsubscribeSpy.calledOnce).to.be.true;
    stub.restore();
  });
  it('return undefined when not exists', async () => {
    const snapshot = { exists: () => false };
    const stub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      c(snapshot);
      return sinon.fake();
    });
    const result = await onValueOnce(null as any);
    expect(result).to.be.undefined;
    stub.restore();
  });
  it('return object with key when data is object', async () => {
    const data = { data: 'test' };
    const snapshot = { key: 'test-key', exists: () => true, val: () => data };
    const stub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      c(snapshot);
      return sinon.fake();
    });
    const result = await onValueOnce(null as any);
    expect(result).to.eql({ key: 'test-key', data: 'test' });
    stub.restore();
  });
  it('return array when data is array', async () => {
    const data = [{ data: 'test' }];
    const snapshot = { key: 'test-key', exists: () => true, val: () => data };
    const stub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      c(snapshot);
      return sinon.fake();
    });
    const result = await onValueOnce(null as any);
    expect(result).to.eq(data);
    stub.restore();
  });
  it('return primitive data when data is primitive', async () => {
    const data = 'test';
    const snapshot = { key: 'test-key', exists: () => true, val: () => data };
    const stub = sinon.stub(service, 'onValue').callsFake((q, c) => {
      c(snapshot);
      return sinon.fake();
    });
    const result = await onValueOnce(null as any);
    expect(result).to.eq(data);
    stub.restore();
  });
});

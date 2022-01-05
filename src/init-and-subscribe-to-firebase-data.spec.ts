import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import * as service from './firebase-service';
import { DatabaseReference } from './firebase-types';
import { initAndSubscribeToFirebaseData } from './init-and-subscribe-to-firebase-data';

describe('init-and-subscribe-to-firebase-data should', () => {
  const setupPrototypeWithUndefined = () => {
    return sinon
      .stub(service, 'onValue')
      .callsFake((query, callback, defaultValue, firebaseConfig) => {
        callback(undefined);
        return () => {};
      });
  };
  const setupPrototypeWithData = (
    data: any,
    configCallback: (c: any) => void
  ) => {
    return sinon
      .stub(service, 'onValue')
      .callsFake((query, callback, defaultValue, firebaseConfig) => {
        callback(data);
        configCallback(firebaseConfig);
        return () => {};
      });
  };

  it('call with config in simplest overload', () => {
    const data: any = null;
    let configResult: any = null;
    const stub = setupPrototypeWithData(data, c => (configResult = c));
    const config = { key: 'test ' };
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, null, config);
    expect(configResult).to.eq(config);
    stub.restore();
  });
  it('call with config in callback overload', () => {
    const data: any = { data: 'test' };
    let configResult: any = null;
    let dataResult: any = null;
    const stub = setupPrototypeWithData(data, c => (configResult = c));
    const config = { key: 'test' };
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, null, d => (dataResult = d), config);
    expect(configResult).to.eq(config);
    expect(dataResult).to.eq(data);
    stub.restore();
  });
  it('call with config in commit overload', () => {
    const data: any = { data: 'test' };
    const mutation = 'test-mutation';
    let configResult: any = null;
    let dataResult: any = null;
    let mutationResult = '';
    const stub = setupPrototypeWithData(data, c => (configResult = c));
    const config = { key: 'test' };
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(
      ref,
      null,
      (m, v) => {
        dataResult = v;
        mutationResult = m;
      },
      mutation,
      config
    );
    expect(configResult).to.eq(config);
    expect(dataResult).to.eq(data);
    expect(mutationResult).to.eq(mutation);
    stub.restore();
  });
  it('call set when undefined and defaultValue is not null or undefined', () => {
    const setStub = sinon.stub(service, 'set');
    const stub = setupPrototypeWithUndefined();
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, 1);
    expect(setStub.calledOnceWithExactly(ref, 1, undefined)).to.be.true;
    setStub.restore();
    stub.restore();
  });
  it('not call set when undefined and defaultValue is null', () => {
    const setStub = sinon.stub(service, 'set');
    const stub = setupPrototypeWithUndefined();
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, null);
    expect(setStub.called).to.be.false;
    setStub.restore();
    stub.restore();
  });
  it('not call set when undefined and defaultValue is undefined', () => {
    const setStub = sinon.stub(service, 'set');
    const stub = setupPrototypeWithUndefined();
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, undefined);
    expect(setStub.called).to.be.false;
    setStub.restore();
    stub.restore();
  });
});

import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { FirebaseService } from './firebase-service';
import { DatabaseReference } from './firebase-types';
import { initAndSubscribeToFirebaseData } from './init-and-subscribe-to-firebase-data';

describe('init-and-subscribe-to-firebase-data should', () => {
  const setupPrototypeWithUndefined = () => {
    FirebaseService.prototype.onValue = <T>(
      query: any,
      callback: (d: any) => void,
      defaultValue?: T,
      firebaseConfig?: any
    ) => {
      callback(undefined);
      return () => {};
    };
  };
  const setupPrototypeWithData = (
    data: any,
    configCallback: (c: any) => void
  ) => {
    FirebaseService.prototype.onValue = <T>(
      query: any,
      callback: (d: any) => void,
      defaultValue?: T,
      firebaseConfig?: any
    ) => {
      callback(data);
      configCallback(firebaseConfig);
      return () => {};
    };
  };

  it('call with config in simplest overload', () => {
    const data: any = null;
    let configResult: any = null;
    setupPrototypeWithData(data, c => (configResult = c));
    const config = { key: 'test ' };
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, null, config);
    expect(configResult).to.eq(config);
  });
  it('call with config in callback overload', () => {
    const data: any = { data: 'test' };
    let configResult: any = null;
    let dataResult: any = null;
    setupPrototypeWithData(data, c => (configResult = c));
    const config = { key: 'test' };
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, null, d => (dataResult = d), config);
    expect(configResult).to.eq(config);
    expect(dataResult).to.eq(data);
  });
  it('call with config in commit overload', () => {
    const data: any = { data: 'test' };
    const mutation = 'test-mutation';
    let configResult: any = null;
    let dataResult: any = null;
    let mutationResult = '';
    setupPrototypeWithData(data, c => (configResult = c));
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
  });
  it('call set when undefined and defaultValue is not null or undefined', () => {
    const spy = sinon.fake();
    FirebaseService.prototype.set = spy;
    setupPrototypeWithUndefined();
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, 1);
    expect(spy.calledOnceWithExactly(ref, 1, undefined)).to.be.true;
  });
  it('not call set when undefined and defaultValue is null', () => {
    const spy = sinon.fake();
    FirebaseService.prototype.set = spy;
    setupPrototypeWithUndefined();
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, null);
    expect(spy.called).to.be.false;
  });
  it('not call set when undefined and defaultValue is undefined', () => {
    const spy = sinon.fake();
    FirebaseService.prototype.set = spy;
    setupPrototypeWithUndefined();
    const ref: DatabaseReference = null as any;
    initAndSubscribeToFirebaseData(ref, undefined);
    expect(spy.called).to.be.false;
  });
});

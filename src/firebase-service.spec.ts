import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import * as db from './firebase-wrappers';
import * as service from './firebase-service';
import { Unsubscribe } from './firebase-types';

describe('firebase-service', () => {
  const config: any = { apiKey: 'test-api-key', appId: 'test-app-id' };
  beforeEach(() => service.closeApp());
  describe('init should', () => {
    const appObj: any = { key: 'app' };
    const dbObj: any = { key: 'db' };
    it('initialize firebase app when config passed in', () => {
      const stub1 = sinon.stub(db, 'initializeApp');
      stub1.withArgs(config).returns(appObj);
      const stub2 = sinon.stub(db, 'getDatabase');
      stub2.withArgs(appObj).returns(dbObj);
      const stubs = [stub1, stub2];
      service.init(config);
      stubs.forEach(x => {
        expect(x.calledOnce).to.be.true;
        x.restore();
      });
    });
    it('throw error when no config passed in and no already-inited app passed in', () => {
      const stubs = [
        sinon.stub(db, 'initializeApp'),
        sinon.stub(db, 'getDatabase'),
      ];
      let errorThrown = false;
      try {
        service.init(null);
      } catch (err) {
        errorThrown = true;
      }
      expect(errorThrown, 'No error thrown').to.be.true;
      stubs.forEach(x => {
        expect(x.called).to.be.false;
        x.restore();
      });
    });
    it('use already-inited app when passed in', () => {
      const stubs = [
        sinon.stub(db, 'initializeApp'),
        sinon.stub(db, 'getDatabase'),
      ];
      const app = { name: 'test-app' };
      const result = service.init(app);
      expect(stubs[0].called).to.be.false;
      expect(stubs[1].called).to.be.true;
      stubs.forEach(x => x.restore());
      expect(result.app).to.eq(app);
    });
    it('not initialize app after already initialized', () => {
      const stub1 = sinon.stub(db, 'initializeApp');
      stub1.returns(appObj);
      const stub2 = sinon.stub(db, 'getDatabase');
      stub2.returns(dbObj);
      const stubs = [stub1, stub2];
      service.init(config);
      service.init(config);
      stubs.forEach(x => {
        expect(x.calledOnce).to.be.true;
        x.restore();
      });
    });
  });
  describe('ref should', () => {
    it('call init', () => {
      const stubs: sinon.SinonStub[] = [];
      stubs.push(sinon.stub(db, 'ref'));
      const initStub = sinon.stub(db, 'initializeApp');
      stubs.push(initStub);
      stubs.push(sinon.stub(db, 'getDatabase'));
      service.ref('test', config);
      expect(initStub.calledWithExactly(config)).to.be.true;
      stubs.forEach(x => x.restore());
    });
    it('call firebase ref', () => {
      const stub = sinon.stub(db, 'ref');
      service.ref('test');
      expect(stub.calledWith(sinon.match.any, 'test')).to.be.true;
      stub.restore();
    });
  });
  describe('getPath should', () => {
    it('add missing slash separator', () => {
      const path = service.getPath({ key: 'parentPath' } as any, 'childPath');
      expect(path).to.eq('parentPath/childPath');
    });
    it('not add slash when already exists in childPath', () => {
      const path = service.getPath({ key: 'parentPath' } as any, '/childPath');
      expect(path).to.eq('parentPath/childPath');
    });
    it('not add slash when already exists in parentPath', () => {
      const path = service.getPath({ key: 'parentPath/' } as any, 'childPath');
      expect(path).to.eq('parentPath/childPath');
    });
    it('recurse parent path', () => {
      const parentRef: any = {
        key: 'parentPath',
        parent: { key: 'grandparentPath' },
      };
      const path = service.getPath(parentRef, 'childPath');
      expect(path).to.eq('grandparentPath/parentPath/childPath');
    });
  });
  describe('onValue should', () => {
    it('call init', () => {
      const stubs: sinon.SinonStub[] = [];
      stubs.push(sinon.stub(db, 'onValue'));
      const initStub = sinon.stub(db, 'initializeApp');
      stubs.push(initStub);
      stubs.push(sinon.stub(db, 'getDatabase'));
      service.onValue(null as any, null as any, null as any, config);
      expect(initStub.calledWithExactly(config)).to.be.true;
      stubs.forEach(x => x.restore());
    });
    it('call firebase onValue', () => {
      const data = { data: 'test' };
      const snapshot = { exists: () => true, key: 'test-key', val: () => data };
      const stub = sinon.stub(db, 'onValue').callsFake((q, c): Unsubscribe => {
        c(snapshot as any);
        return () => {};
      });
      let dataResult: any = null;
      service.onValue(null as any, d => (dataResult = d));
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(data);
      stub.restore();
    });
    it('return defaultValue when not null or empty', () => {
      const data = null as any;
      const snapshot = { exists: () => true, key: 'test-key', val: () => data };
      const stub = sinon.stub(db, 'onValue').callsFake((q, c): Unsubscribe => {
        c(snapshot as any);
        return () => {};
      });
      let dataResult: any = null;
      service.onValue(null as any, d => (dataResult = d), 1);
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(1);
      stub.restore();
    });
    it('return defaultValue when not found', () => {
      const data = null as any;
      const snapshot = { exists: () => false, key: '', val: () => data };
      const stub = sinon.stub(db, 'onValue').callsFake((q, c): Unsubscribe => {
        c(snapshot as any);
        return () => {};
      });
      let dataResult: any = null;
      service.onValue(null as any, d => (dataResult = d), 1);
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(1);
      stub.restore();
    });
    it('return zero instead of defaultValue when value is zero', () => {
      const data = 0 as any;
      const snapshot = { exists: () => true, key: 'test-key', val: () => data };
      const stub = sinon.stub(db, 'onValue').callsFake((q, c): Unsubscribe => {
        c(snapshot as any);
        return () => {};
      });
      let dataResult: any = null;
      service.onValue(null as any, d => (dataResult = d), 1);
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(0);
      stub.restore();
    });
  });
  describe('onChildAdded should', () => {
    it('call init', () => {
      const stubs: sinon.SinonStub[] = [];
      stubs.push(sinon.stub(db, 'onChildAdded'));
      const initStub = sinon.stub(db, 'initializeApp');
      stubs.push(initStub);
      stubs.push(sinon.stub(db, 'getDatabase'));
      service.onChildAdded(null as any, null as any, null as any, config);
      expect(initStub.calledWithExactly(config)).to.be.true;
      stubs.forEach(x => x.restore());
    });
    it('call firebase onChildAdded', () => {
      const data = { data: 'test' };
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon
        .stub(db, 'onChildAdded')
        .callsFake((q, c): Unsubscribe => {
          c(snapshot as any, '');
          return () => {};
        });
      let dataResult: any = null;
      service.onChildAdded(null as any, d => (dataResult = d));
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eql({ data: 'test', key: 'test-key' });
      stub.restore();
    });
    it('return defaultValue when not found', () => {
      const data = null as any;
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon
        .stub(db, 'onChildAdded')
        .callsFake((q, c): Unsubscribe => {
          c(snapshot as any, '');
          return () => {};
        });
      let dataResult: any = null;
      service.onChildAdded(null as any, d => (dataResult = d), 1);
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(1);
      stub.restore();
    });
    it('return zero instead of defaultValue if zero is found', () => {
      const data = 0 as any;
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon
        .stub(db, 'onChildAdded')
        .callsFake((q, c): Unsubscribe => {
          c(snapshot as any, '');
          return () => {};
        });
      let dataResult: any = null;
      service.onChildAdded(null as any, d => (dataResult = d), 1);
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(0);
      stub.restore();
    });
    it('add snapshot key to result when of object type', () => {
      const data = { data: 'test' } as any;
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon
        .stub(db, 'onChildAdded')
        .callsFake((q, c): Unsubscribe => {
          c(snapshot as any, '');
          return () => {};
        });
      let dataResult: any = null;
      service.onChildAdded(null as any, d => (dataResult = d));
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eql({ data: 'test', key: 'test-key' });
      stub.restore();
    });
  });
  describe('onChildChanged should', () => {
    it('call init', () => {
      const stubs: sinon.SinonStub[] = [];
      stubs.push(sinon.stub(db, 'onChildChanged'));
      const initStub = sinon.stub(db, 'initializeApp');
      stubs.push(initStub);
      stubs.push(sinon.stub(db, 'getDatabase'));
      service.onChildChanged(null as any, null as any, null as any, config);
      expect(initStub.calledWithExactly(config)).to.be.true;
      stubs.forEach(x => x.restore());
    });
    it('call firebase onChildChanged', () => {
      const data = { data: 'test' };
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon
        .stub(db, 'onChildChanged')
        .callsFake((q, c): Unsubscribe => {
          c(snapshot as any, '');
          return () => {};
        });
      let dataResult: any = null;
      service.onChildChanged(null as any, d => (dataResult = d));
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(data);
      stub.restore();
    });
    it('return defaultValue when not found', () => {
      const data = null as any;
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon
        .stub(db, 'onChildChanged')
        .callsFake((q, c): Unsubscribe => {
          c(snapshot as any, '');
          return () => {};
        });
      let dataResult: any = null;
      service.onChildChanged(null as any, d => (dataResult = d), 1);
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(1);
      stub.restore();
    });
    it('return zero instead of defaultValue if zero is found', () => {
      const data = 0 as any;
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon
        .stub(db, 'onChildChanged')
        .callsFake((q, c): Unsubscribe => {
          c(snapshot as any, '');
          return () => {};
        });
      let dataResult: any = null;
      service.onChildChanged(null as any, d => (dataResult = d), 1);
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(0);
      stub.restore();
    });
  });
  describe('onChildAddedWithCommit should', () => {
    it('map array', () => {
      const childAddedStub = sinon
        .stub(service, 'onChildAdded')
        .callsFake((q, c) => {
          c({ key: 'test-key', data: 'added-data' });
          return () => ({});
        });
      const commitSpy = sinon.fake();
      const mapStub = sinon.stub().callsFake((d: any) => ({ ...d }));
      const arr: any[] = [];
      service.onChildAddedWithCommit(
        null as any,
        () => arr,
        commitSpy,
        'test-mutation',
        mapStub
      );
      expect(mapStub.calledOnceWith({ key: 'test-key', data: 'added-data' })).to
        .be.true;
      childAddedStub.restore();
    });
    it('commit mutation', () => {
      const childAddedStub = sinon
        .stub(service, 'onChildAdded')
        .callsFake((q, c) => {
          c({ key: 'test-key', data: 'added-data' });
          return () => ({});
        });
      const arr: any[] = [];
      const spy = sinon.fake();
      service.onChildAddedWithCommit(
        null as any,
        () => arr,
        spy,
        'test-mutation'
      );
      expect(
        spy.calledOnceWith('test-mutation', [
          { key: 'test-key', data: 'added-data' },
        ])
      ).to.be.true;
      childAddedStub.restore();
    });
    it('commit mutation for primitive data', () => {
      const childAddedStub = sinon
        .stub(service, 'onChildAdded')
        .callsFake((q, c) => {
          c(1);
          return () => ({});
        });
      const arr: any[] = [0];
      const spy = sinon.fake();
      service.onChildAddedWithCommit(
        null as any,
        () => arr,
        spy,
        'test-mutation'
      );
      expect(spy.calledOnceWith('test-mutation', [0, 1])).to.be.true;
      childAddedStub.restore();
    });
  });
  describe('onChildChangedWithCommit should', () => {
    it('map array', () => {
      const childChangedStub = sinon
        .stub(service, 'onChildChanged')
        .callsFake((q, c) => {
          c({ key: 'test-key', data: 'added-data' });
          return () => ({});
        });
      const commitSpy = sinon.fake();
      const existingData = { key: 'test-key', data: 'orig-data' };
      const mapStub = sinon.stub().callsFake((d: any) => ({ ...d }));
      const arr: any[] = [existingData];
      service.onChildChangedWithCommit(
        null as any,
        () => arr,
        commitSpy,
        'test-mutation',
        mapStub
      );
      expect(mapStub.calledTwice).to.be.true;
      expect(mapStub.calledWith(existingData)).to.be.true;
      expect(mapStub.calledWith({ key: 'test-key', data: 'added-data' })).to.be
        .true;
      childChangedStub.restore();
    });
    it('commit mutation', () => {
      const childChangedStub = sinon
        .stub(service, 'onChildChanged')
        .callsFake((q, c) => {
          c({ key: 'test-key', data: 'added-data' });
          return () => ({});
        });
      const arr: any[] = [{ key: 'test-key', data: 'orig-data' }];
      const spy = sinon.fake();
      service.onChildChangedWithCommit(
        null as any,
        () => arr,
        spy,
        'test-mutation'
      );
      expect(
        spy.calledOnceWith('test-mutation', [
          { key: 'test-key', data: 'added-data' },
        ])
      ).to.be.true;
      childChangedStub.restore();
    });
  });
  describe('push should', () => {
    it('call init', async () => {
      const stubs: sinon.SinonStub[] = [];
      stubs.push(sinon.stub(db, 'push').resolves(null as any));
      const initStub = sinon.stub(db, 'initializeApp');
      stubs.push(initStub);
      stubs.push(sinon.stub(db, 'getDatabase'));
      await service.push(null as any, null as any, config);
      expect(initStub.calledOnceWithExactly(config)).to.be.true;
      stubs.forEach(x => x.restore());
    });
    it('call firebase push', async () => {
      const refResult = { key: 'test' } as any;
      const refArg = { key: 'test-arg' } as any;
      const data = { data: 'test' };
      const stub = sinon.stub(db, 'push').resolves(refResult);
      const result = await service.push(refArg, data);
      expect(stub.calledOnceWithExactly(refArg, data)).to.be.true;
      expect(result).to.eq(refResult);
      stub.restore();
    });
  });
  describe('remove should', () => {
    it('call init', async () => {
      const stubs: sinon.SinonStub[] = [];
      const removeStub = sinon.stub(db, 'remove');
      stubs.push(removeStub);
      removeStub.callsFake(() => Promise.resolve());
      const initStub = sinon.stub(db, 'initializeApp');
      stubs.push(initStub);
      stubs.push(sinon.stub(db, 'getDatabase'));
      await service.remove(null as any, config);
      expect(initStub.calledOnceWithExactly(config)).to.be.true;
      stubs.forEach(x => x.restore());
    });
    it('call firebase remove', async () => {
      const refArg = { key: 'test-arg' } as any;
      const stub = sinon.stub(db, 'remove').callsFake(() => Promise.resolve());
      await service.remove(refArg);
      expect(stub.calledOnceWithExactly(refArg)).to.be.true;
      stub.restore();
    });
  });
  describe('update should', () => {
    it('call init', async () => {
      const stubs: sinon.SinonStub[] = [];
      const updateStub = sinon.stub(db, 'update');
      stubs.push(updateStub);
      updateStub.resolves(null as any);
      const initStub = sinon.stub(db, 'initializeApp');
      stubs.push(initStub);
      stubs.push(sinon.stub(db, 'getDatabase'));
      await service.update(null as any, null as any, config);
      expect(initStub.calledOnceWithExactly(config)).to.be.true;
      stubs.forEach(x => x.restore());
    });
    it('call firebase update', async () => {
      const refResult = { key: 'test' } as any;
      const refArg = { key: 'test-arg' } as any;
      const data = { data: 'test' };
      const stub = sinon.stub(db, 'update').resolves(refResult);
      const result = await service.update(refArg, data);
      expect(stub.calledOnceWithExactly(refArg, data)).to.be.true;
      expect(result).to.eq(refResult);
      stub.restore();
    });
  });
  describe('set should', () => {
    it('call init', async () => {
      const stubs: sinon.SinonStub[] = [];
      const setStub = sinon.stub(db, 'set');
      stubs.push(setStub);
      setStub.resolves(null as any);
      const initStub = sinon.stub(db, 'initializeApp');
      stubs.push(initStub);
      stubs.push(sinon.stub(db, 'getDatabase'));
      await service.set(null as any, null as any, config);
      expect(initStub.calledOnceWithExactly(config)).to.be.true;
      stubs.forEach(x => x.restore());
    });
    it('call firebase set', async () => {
      const refResult = { key: 'test' } as any;
      const refArg = { key: 'test-arg' } as any;
      const data = { data: 'test' };
      const stub = sinon.stub(db, 'set').resolves(refResult);
      const result = await service.set(refArg, data);
      expect(stub.calledOnceWithExactly(refArg, data)).to.be.true;
      expect(result).to.eq(refResult);
      stub.restore();
    });
  });
  describe('get should', () => {
    it('call init', async () => {
      const stubs: sinon.SinonStub[] = [];
      const getStub = sinon.stub(db, 'get');
      stubs.push(getStub);
      getStub.resolves({ val: () => ({}) } as any);
      const initStub = sinon.stub(db, 'initializeApp');
      stubs.push(initStub);
      stubs.push(sinon.stub(db, 'getDatabase'));
      await service.get(null as any, null as any, config);
      expect(initStub.calledOnceWithExactly(config)).to.be.true;
      stubs.forEach(x => x.restore());
    });
    it('return defaultValue when not found', async () => {
      const stub = sinon.stub(db, 'get').resolves({ val: () => null } as any);
      const result = await service.get(null as any, 1);
      expect(result).to.eq(1);
      stub.restore();
    });
    it('call firebase get', async () => {
      const data = { data: 'test' };
      const stub = sinon.stub(db, 'get').resolves({ val: () => data } as any);
      const result = await service.get(null as any);
      expect(stub.calledOnceWithExactly(null as any)).to.be.true;
      expect(result).to.eq(data);
      stub.restore();
    });
  });
});

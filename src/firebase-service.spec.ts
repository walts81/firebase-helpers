import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import * as db from './firebase-wrappers';
import { FirebaseService } from './firebase-service';
import { Unsubscribe } from './firebase-types';

describe('FirebaseService', () => {
  describe('ref should', () => {
    it('call init', () => {
      const stub = sinon.stub(db, 'ref');
      const spy = sinon.fake();
      const config = { key: 'test' };
      FirebaseService.prototype.init = spy;
      FirebaseService.instance.ref('test', config);
      expect(spy.calledWithExactly(config)).to.be.true;
      stub.restore();
    });
    it('call firebase ref', () => {
      const stub = sinon.stub(db, 'ref');
      const spy = sinon.fake();
      FirebaseService.instance.ref('test');
      expect(stub.calledWith(null as any, 'test')).to.be.true;
      stub.restore();
    });
  });
  describe('getPath should', () => {
    it('add missing slash separator', () => {
      const path = FirebaseService.instance.getPath(
        'parentPath' as any,
        'childPath'
      );
      expect(path).to.eq('parentPath/childPath');
    });
    it('not add slash when already exists in childPath', () => {
      const path = FirebaseService.instance.getPath(
        'parentPath' as any,
        '/childPath'
      );
      expect(path).to.eq('parentPath/childPath');
    });
    it('not add slash when already exists in parentPath', () => {
      const path = FirebaseService.instance.getPath(
        'parentPath/' as any,
        'childPath'
      );
      expect(path).to.eq('parentPath/childPath');
    });
  });
  describe('onValue should', () => {
    it('call init', () => {
      const stub = sinon.stub(db, 'onValue');
      const spy = sinon.fake();
      const config = { key: 'test' };
      FirebaseService.prototype.init = spy;
      FirebaseService.instance.onValue(
        null as any,
        null as any,
        null as any,
        config
      );
      expect(spy.calledWithExactly(config)).to.be.true;
      stub.restore();
    });
    it('call firebase onValue', () => {
      const data = { data: 'test' };
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon.stub(db, 'onValue').callsFake((q, c): Unsubscribe => {
        c(snapshot as any);
        return () => {};
      });
      let dataResult: any = null;
      FirebaseService.instance.onValue(null as any, d => (dataResult = d));
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(data);
      stub.restore();
    });
    it('return defaultValue when not found', () => {
      const data = null as any;
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon.stub(db, 'onValue').callsFake((q, c): Unsubscribe => {
        c(snapshot as any);
        return () => {};
      });
      let dataResult: any = null;
      FirebaseService.instance.onValue(null as any, d => (dataResult = d), 1);
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(1);
      stub.restore();
    });
    it('return zero instead of defaultValue if zero is found', () => {
      const data = 0 as any;
      const snapshot = { key: 'test-key', val: () => data };
      const stub = sinon.stub(db, 'onValue').callsFake((q, c): Unsubscribe => {
        c(snapshot as any);
        return () => {};
      });
      let dataResult: any = null;
      FirebaseService.instance.onValue(null as any, d => (dataResult = d), 1);
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(0);
      stub.restore();
    });
  });
  describe('onChildAdded should', () => {
    it('call init', () => {
      const stub = sinon.stub(db, 'onChildAdded');
      const spy = sinon.fake();
      const config = { key: 'test' };
      FirebaseService.prototype.init = spy;
      FirebaseService.instance.onChildAdded(
        null as any,
        null as any,
        null as any,
        config
      );
      expect(spy.calledWithExactly(config)).to.be.true;
      stub.restore();
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
      FirebaseService.instance.onChildAdded(null as any, d => (dataResult = d));
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
      FirebaseService.instance.onChildAdded(
        null as any,
        d => (dataResult = d),
        1
      );
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
      FirebaseService.instance.onChildAdded(
        null as any,
        d => (dataResult = d),
        1
      );
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
      FirebaseService.instance.onChildAdded(null as any, d => (dataResult = d));
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eql({ data: 'test', key: 'test-key' });
      stub.restore();
    });
  });
  describe('onChildChanged should', () => {
    it('call init', () => {
      const stub = sinon.stub(db, 'onChildChanged');
      const spy = sinon.fake();
      const config = { key: 'test' };
      FirebaseService.prototype.init = spy;
      FirebaseService.instance.onChildChanged(
        null as any,
        null as any,
        null as any,
        config
      );
      expect(spy.calledWithExactly(config)).to.be.true;
      stub.restore();
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
      FirebaseService.instance.onChildChanged(
        null as any,
        d => (dataResult = d)
      );
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
      FirebaseService.instance.onChildChanged(
        null as any,
        d => (dataResult = d),
        1
      );
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
      FirebaseService.instance.onChildChanged(
        null as any,
        d => (dataResult = d),
        1
      );
      expect(stub.calledOnce).to.be.true;
      expect(dataResult).to.eq(0);
      stub.restore();
    });
  });
  describe('push should', () => {
    it('call init', async () => {
      const stub = sinon.stub(db, 'push').resolves(null as any);
      const spy = sinon.fake();
      const config = { key: 'test' };
      FirebaseService.prototype.init = spy;
      await FirebaseService.instance.push(null as any, null as any, config);
      expect(spy.calledOnceWithExactly(config)).to.be.true;
      stub.restore();
    });
    it('call firebase push', async () => {
      const refResult = { key: 'test' } as any;
      const refArg = { key: 'test-arg' } as any;
      const data = { data: 'test' };
      const stub = sinon.stub(db, 'push').resolves(refResult);
      const result = await FirebaseService.instance.push(refArg, data);
      expect(stub.calledOnceWithExactly(refArg, data)).to.be.true;
      expect(result).to.eq(refResult);
      stub.restore();
    });
  });
  describe('remove should', () => {
    it('call init', async () => {
      const stub = sinon.stub(db, 'remove').callsFake(x => Promise.resolve());
      const spy = sinon.fake();
      const config = { key: 'test' };
      FirebaseService.prototype.init = spy;
      await FirebaseService.instance.remove(null as any, config);
      expect(spy.calledOnceWithExactly(config)).to.be.true;
      stub.restore();
    });
    it('call firebase remove', async () => {
      const refArg = { key: 'test-arg' } as any;
      const stub = sinon.stub(db, 'remove').callsFake(x => Promise.resolve());
      await FirebaseService.instance.remove(refArg);
      expect(stub.calledOnceWithExactly(refArg)).to.be.true;
      stub.restore();
    });
  });
  describe('update should', () => {
    it('call init', async () => {
      const stub = sinon.stub(db, 'update').resolves(null as any);
      const spy = sinon.fake();
      const config = { key: 'test' };
      FirebaseService.prototype.init = spy;
      await FirebaseService.instance.update(null as any, null as any, config);
      expect(spy.calledOnceWithExactly(config)).to.be.true;
      stub.restore();
    });
    it('call firebase update', async () => {
      const refResult = { key: 'test' } as any;
      const refArg = { key: 'test-arg' } as any;
      const data = { data: 'test' };
      const stub = sinon.stub(db, 'update').resolves(refResult);
      const result = await FirebaseService.instance.update(refArg, data);
      expect(stub.calledOnceWithExactly(refArg, data)).to.be.true;
      expect(result).to.eq(refResult);
      stub.restore();
    });
  });
  describe('set should', () => {
    it('call init', async () => {
      const stub = sinon.stub(db, 'set').resolves(null as any);
      const spy = sinon.fake();
      const config = { key: 'test' };
      FirebaseService.prototype.init = spy;
      await FirebaseService.instance.set(null as any, null as any, config);
      expect(spy.calledOnceWithExactly(config)).to.be.true;
      stub.restore();
    });
    it('call firebase set', async () => {
      const refResult = { key: 'test' } as any;
      const refArg = { key: 'test-arg' } as any;
      const data = { data: 'test' };
      const stub = sinon.stub(db, 'set').resolves(refResult);
      const result = await FirebaseService.instance.set(refArg, data);
      expect(stub.calledOnceWithExactly(refArg, data)).to.be.true;
      expect(result).to.eq(refResult);
      stub.restore();
    });
  });
  describe('get should', () => {
    it('call init', async () => {
      const stub = sinon.stub(db, 'get').resolves({ val: () => ({}) } as any);
      const spy = sinon.fake();
      const config = { key: 'test' };
      FirebaseService.prototype.init = spy;
      await FirebaseService.instance.get(null as any, null as any, config);
      expect(spy.calledOnceWithExactly(config)).to.be.true;
      stub.restore();
    });
    it('return defaultValue when not found', async () => {
      const stub = sinon.stub(db, 'get').resolves({ val: () => null } as any);
      const result = await FirebaseService.instance.get(null as any, 1);
      expect(result).to.eq(1);
      stub.restore();
    });
    it('call firebase get', async () => {
      const data = { data: 'test' };
      const stub = sinon.stub(db, 'get').resolves({ val: () => data } as any);
      const result = await FirebaseService.instance.get(null as any);
      expect(stub.calledOnceWithExactly(null as any)).to.be.true;
      expect(result).to.eq(data);
      stub.restore();
    });
  });
});

import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import * as db from './firebase-wrappers';
import * as service from './firebase-service';
import { removeAll } from './remove-all';

describe('removeAll should', () => {
  it('remove all nodes for given query', async () => {
    const stubs: sinon.SinonStub[] = [];
    stubs.push(sinon.stub(db, 'query').returns({ key: 'test-query' } as any));
    const list = [
      {
        exists: () => true,
        ref: 'test-path-1',
      },
      {
        exists: () => true,
        ref: 'test-path-2',
      },
      {
        exists: () => false,
        ref: 'test-path-3',
      },
      {
        exists: () => true,
        ref: 'test-path-4',
      },
    ];
    const s2 = sinon.stub(db, 'get').resolves({
      forEach: callback => {
        list.forEach(node => callback(node));
      },
    } as any);
    stubs.push(s2);
    stubs.push(
      sinon.stub(service, 'init').returns({
        app: { key: 'app' } as any,
        database: { key: 'database' } as any,
      })
    );
    stubs.push(
      sinon.stub(db, 'refFromURL').callsFake((arg1, url) => url as any)
    );
    const s5 = sinon.stub(db, 'remove');
    stubs.push(s5);
    await removeAll({} as any);
    expect(
      s2.calledWith(sinon.match.has('key', 'test-query')),
      'Failed to get query object'
    ).to.be.true;
    expect(s5.calledThrice, 'Failed to call remove on each node').to.be.true;
    stubs.forEach(x => x.restore());
  });
});

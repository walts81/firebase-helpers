import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { getArgsToUse } from './args-helper';

describe('args-helper should', () => {
  it('return commit+mutation when used for 1+2 args', () => {
    const spy = sinon.fake();
    const result = getArgsToUse(spy, 'test-mutation', null, null);
    const data = { data: 'test' };
    result.commitToUse(result.mutationToUse, data);
    expect(spy.calledOnceWithExactly('test-mutation', data)).to.be.true;
  });
  it('return commit+mutation when used for 2+3 args', () => {
    const spy = sinon.fake();
    const result = getArgsToUse(null, spy, 'test-mutation', null);
    const data = { data: 'test' };
    result.commitToUse(result.mutationToUse, data);
    expect(spy.calledOnceWithExactly('test-mutation', data)).to.be.true;
  });
});

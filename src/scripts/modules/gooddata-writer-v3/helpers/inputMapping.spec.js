import assert from 'assert';
import {parseInputMapping, createInputMapping} from './inputMapping';
import {fromJS} from 'immutable';


describe('test input mapping helper', () => {
  const configuration = fromJS({
    storage: {
      input: {
        tables: [
          {source: 'some.table'}
        ]
      }
    }
  });

  const localState = fromJS({source: 'some.table'});
  const parsed = parseInputMapping(configuration);
  it('should test parse empty im', () => {
    assert.deepEqual(parseInputMapping(fromJS({})).toJS(), {});
  });

  it('should test parse nonempty im', () => {
    assert.deepEqual(parsed.toJS(), localState.toJS());
  });

  it('should test create nonempty im', () => {
    const created = createInputMapping(localState);
    assert.deepEqual(created.toJS(), configuration.toJS());
  });
});

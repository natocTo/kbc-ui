import assert from 'assert';
import Immutable from 'immutable';
import sections from './sections';

describe('sections', function() {
  describe('demonstrate bug, invalidKey gets passed through', function() {
    const createBySectionsFn = sections.makeCreateFn(
      null,
      Immutable.fromJS([
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                key: localState.get('key', '')
              }
            });
          }
        }
      ])
    );
    const parseBySectionsFn = sections.makeParseFn(
      null,
      Immutable.fromJS([
        {
          onLoad: function(configuration) {
            return Immutable.fromJS({
              key: configuration.getIn(['parameters', 'key'], '')
            });
          }
        }
      ])
    );
    const configuration = Immutable.fromJS(
      {
        parameters: {
          key: 'value',
          invalidKey: 'invalidValue'
        }
      }
    );
    const expected = {
      parameters: {
        key: 'value'
      }
    };
    assert.equal(expected, createBySectionsFn(parseBySectionsFn(configuration)).toJS());
  });
});

import assert from 'assert';
import Immutable from 'immutable';
import sections from './sections';

describe('sections', function() {
  it('should simple merge', function() {
    const createBySectionsFn = sections.makeCreateFn(
      null,
      Immutable.fromJS([
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                key1: localState.get('key1', '')
              }
            });
          }
        },
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                key2: localState.get('key2', '')
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
              key1: configuration.getIn(['parameters', 'key1'], '')
            });
          }
        },
        {
          onLoad: function(configuration) {
            return Immutable.fromJS({
              key2: configuration.getIn(['parameters', 'key2'], '')
            });
          }
        }

      ])
    );
    const configuration = Immutable.fromJS({
      parameters: {
        key1: 'value1',
        key2: 'value2'
      }
    });
    assert.deepEqual(configuration.toJS(), createBySectionsFn(parseBySectionsFn(configuration)).toJS());
  });

  it('should deep merge', function() {
    const createBySectionsFn = sections.makeCreateFn(
      null,
      Immutable.fromJS([
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                nested: {
                  key1: localState.get('key1', '')
                }
              }
            });
          }
        },
        {
          onSave: function(localState) {
            return Immutable.fromJS({
              parameters: {
                nested: {
                  key2: localState.get('key2', '')
                }
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
              key1: configuration.getIn(['parameters', 'nested', 'key1'], '')
            });
          }
        },
        {
          onLoad: function(configuration) {
            return Immutable.fromJS({
              key2: configuration.getIn(['parameters', 'nested', 'key2'], '')
            });
          }
        }

      ])
    );
    const configuration = Immutable.fromJS({
      parameters: {
        nested: {
          key1: 'value1',
          key2: 'value2'
        }
      }
    });
    assert.deepEqual(configuration.toJS(), createBySectionsFn(parseBySectionsFn(configuration)).toJS());
  });

  it('silently demonstrate bug, invalidKey gets passed through', function() {
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
    const configuration = Immutable.fromJS({
      parameters: {
        key: 'value',
        invalidKey: 'invalidValue'
      }
    });

    /*
    in fact this should be, waiting for fix
    const expected = {
      parameters: {
        key: 'value'
      }
    };
    */
    const expected = {
      parameters: {
        key: 'value',
        invalidKey: 'invalidValue'
      }
    };
    assert.deepEqual(expected, createBySectionsFn(parseBySectionsFn(configuration)).toJS());
  });
});

import assert from 'assert';
import Immutable from 'immutable';
import isParsableConfiguration from './isParsableConfiguration';

const create = function(localState) {
  return Immutable.fromJS({
    key1: localState.get('key1', ''),
    key2: localState.get('key2', ''),
    nested: {
      key1: localState.get('nestedKey1'),
      key2: localState.get('nestedKey2')
    }
  });
};

const parse = function(configuration) {
  return Immutable.fromJS({
    key1: configuration.get('key1', ''),
    key2: configuration.get('key2', ''),
    nestedKey1: configuration.getIn(['nested', 'key1'], ''),
    nestedKey2: configuration.getIn(['nested', 'key2'], '')
  });
};

const createConformed = function(localState) {
  return Immutable.fromJS({
    key1: localState.get('key1', ''),
    key2: localState.get('key2', ''),
    nested: {
      key1: localState.get('nestedKey1'),
      key2: localState.get('nestedKey2')
    },
    conformed: {
      key1: localState.get('conformedKey1')
    }
  });
};

const conform = function(configuration) {
  const path = ['conformed', 'key1'];
  const defaultValue = 'conformedValue';
  const conformedConfig = configuration.setIn(path, configuration.getIn(path, defaultValue));
  return conformedConfig;
};

const parseConformed = function(configuration) {
  const conformedConfig = conform(configuration);
  return Immutable.fromJS({
    conformedKey1: conformedConfig.getIn(['conformed', 'key1'], ''),
    key1: conformedConfig.get('key1', ''),
    key2: conformedConfig.get('key2', ''),
    nestedKey1: conformedConfig.getIn(['nested', 'key1'], ''),
    nestedKey2: conformedConfig.getIn(['nested', 'key2'], '')
  });
};


describe('isParsableConfiguration', function() {
  it('empty configuration should be parsable', function() {
    const configuration = Immutable.fromJS({});
    assert.equal(true, isParsableConfiguration(configuration, parse, create, null));
  });
  it('simple full configuration should be parsable', function() {
    const configuration = Immutable.fromJS({
      key1: 'test1',
      key2: 'test2',
      nested: {
        key1: 'test3',
        key2: 'test4'
      }
    });
    assert.equal(true, isParsableConfiguration(configuration, parse, create, null));
  });
  it('invalid configuration should not be parsable', function() {
    const configuration = Immutable.fromJS({
      invalidKey1: 'test',
      key1: 'test1',
      key2: 'test2',
      nested: {
        key1: 'test3',
        key2: 'test4'
      }
    });
    assert.equal(false, isParsableConfiguration(configuration, parse, create, null));
  });

  it('should be parsable with conformed configuration', function() {
    const configuration = Immutable.fromJS({
      key1: 'test1',
      key2: 'test2',
      nested: {
        key1: 'test3',
        key2: 'test4'
      }
    });
    assert.equal(true, isParsableConfiguration(configuration, parseConformed, createConformed, conform));
  });

  it('should not be parsable with conformed configuration', function() {
    const configuration = Immutable.fromJS({
      key1: 'test1',
      key2: 'test2',
      nested: {
        key1: 'test3',
        key2: 'test4'
      }
    });
    assert.equal(false, isParsableConfiguration(configuration, parse, createConformed, conform));
  });
});

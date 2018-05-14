import assert from 'assert';
import Immutable from 'immutable';
import { createConfiguration, parseConfiguration } from './table';
import { cases } from './table.spec.def';

describe('credentials', function() {
  describe('createConfiguration()', function() {
    it('should return an empty config with defaults from an empty local state', function() {
      assert.deepEqual(cases.emptyWithDefaults.configuration, createConfiguration(Immutable.fromJS({})).toJS());
    });
    Object.keys(cases).forEach(function(key) {
      it('should return a valid config for a local state with ' + key, function() {
        assert.deepEqual(cases[key].configuration, createConfiguration(Immutable.fromJS(cases[key].localState)).toJS());
      });
    });
  });

  describe('parseConfiguration()', function() {
    it('should return empty localState with defaults from empty configuration', function() {
      assert.deepEqual(cases.emptyWithDefaults.localState, parseConfiguration(Immutable.fromJS({})).toJS());
    });
    Object.keys(cases).forEach(function(key) {
      it('should return a correct localState with ' + key + ' configuration', function() {
        assert.deepEqual(cases[key].localState, parseConfiguration(Immutable.fromJS(cases[key].configuration)).toJS());
      });
    });
  });
});

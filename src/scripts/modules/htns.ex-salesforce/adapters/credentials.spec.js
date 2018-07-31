import assert from 'assert';
import Immutable from 'immutable';
import { createConfiguration, parseConfiguration, isComplete } from './credentials';
import { cases } from './credentials.spec.def';

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

  describe('isComplete()', function() {
    it('should return false with empty configuration', function() {
      assert.equal(isComplete(Immutable.fromJS({})), false);
    });
    it('should return false with only one parameter filled', function() {
      assert.equal(isComplete(Immutable.fromJS({parameters: {'loginname': 'a'}})), false);
      assert.equal(isComplete(Immutable.fromJS({parameters: {'#password': 'a'}})), false);
      assert.equal(isComplete(Immutable.fromJS({parameters: {'#securitytoken': 'a'}})), false);
    });
    it('should return true when all parameters are filled', function() {
      assert.equal(isComplete(Immutable.fromJS({parameters: {'loginname': 'a', '#password': 'a', '#securitytoken': 'a'}})), true);
    });
  });
});

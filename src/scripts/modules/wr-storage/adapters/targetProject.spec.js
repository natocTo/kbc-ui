import assert from 'assert';
import Immutable from 'immutable';
import adapter from './targetProject';
import { cases } from './targetProject.spec.def';

describe('credentials', function() {
  describe('createConfiguration()', function() {
    it('should return an empty config with defaults from an empty local state', function() {
      assert.deepEqual(cases.emptyWithDefaults.configuration, adapter.createConfiguration(Immutable.fromJS({})).toJS());
    });
    Object.keys(cases).forEach(function(key) {
      it('should return a valid config for a local state with ' + key, function() {
        assert.deepEqual(cases[key].configuration, adapter.createConfiguration(Immutable.fromJS(cases[key].localState)).toJS());
      });
    });
  });

  describe('parseConfiguration()', function() {
    it('should return empty localState with defaults from empty configuration', function() {
      assert.deepEqual(cases.emptyWithDefaults.localState, adapter.parseConfiguration(Immutable.fromJS({})).toJS());
    });
    Object.keys(cases).forEach(function(key) {
      it('should return a correct localState with ' + key + ' configuration', function() {
        assert.deepEqual(cases[key].localState, adapter.parseConfiguration(Immutable.fromJS(cases[key].configuration)).toJS());
      });
    });
  });

  describe('isComplete()', function() {
    it('should return false with empty configuration', function() {
      assert.equal(adapter.isComplete(Immutable.fromJS({})), false);
    });
    it('should return true when parameters are filled', function() {
      assert.equal(adapter.isComplete(Immutable.fromJS({parameters: {'url': 'a', '#token': 'b', 'bucket': 'c'}})), true);
    });
  });
});

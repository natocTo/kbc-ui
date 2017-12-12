var assert = require('assert');
var Immutable = require('immutable');
var createConfiguration = require('./row').createConfiguration;
var parseConfiguration = require('./row').parseConfiguration;
var isParsableConfiguration = require('./row').isParsableConfiguration;
var cases = require('./row.spec.def').cases;

describe('row', function() {
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

  describe('isParsableConfiguration', function() {
    Object.keys(cases).forEach(function(key) {
      it('should return true for ' + key + ' configuration', function() {
        assert.ok(isParsableConfiguration(Immutable.fromJS(cases[key].configuration)));
      });
    });
    it('should return false for an invalid configuration', function() {
      assert.ok(!isParsableConfiguration(Immutable.fromJS({invalid: true})));
    });
  });
});

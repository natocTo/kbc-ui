var assert = require('assert');
var Immutable = require('immutable');
var createConfiguration = require('./row').createConfiguration;
var parseConfiguration = require('./row').parseConfiguration;
var isCompleted = require('./row').isCompleted;
var createEmptyConfiguration = require('./row').createEmptyConfiguration;
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

  describe('isCompleted()', function() {
    it('should return false with empty configuration', function() {
      assert.equal(isCompleted(Immutable.fromJS({})), false);
    });
    it('should return false with only one parameter filled', function() {
      assert.equal(isCompleted(Immutable.fromJS({parameters: {bucket: 'a'}})), false);
      assert.equal(isCompleted(Immutable.fromJS({parameters: {key: 'a'}})), false);
    });
    it('should return true when both parameters are filled', function() {
      assert.equal(isCompleted(Immutable.fromJS({parameters: {bucket: 'a', key: 'a'}})), true);
    });
  });

  describe('createEmptyConfiguration()', function() {
    it('should return a default config with the webalized name filled in', function() {
      assert.deepEqual(createEmptyConfiguration('My Test', 'my-test').toJS(), createConfiguration(Immutable.fromJS({name: 'my-test'})).toJS());
    });
  });
});

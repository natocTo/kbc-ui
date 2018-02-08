var assert = require('assert');
var Immutable = require('immutable');
var createConfiguration = require('./credentials').createConfiguration;
var parseConfiguration = require('./credentials').parseConfiguration;
var isComplete = require('./credentials').isComplete;
var cases = require('./credentials.spec.def').cases;

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
      assert.equal(isComplete(Immutable.fromJS({parameters: {accessKeyId: 'a'}})), false);
      assert.equal(isComplete(Immutable.fromJS({parameters: {'#secretAccessKey': 'a'}})), false);
    });
    it('should return true when both parameters are filled', function() {
      assert.equal(isComplete(Immutable.fromJS({parameters: {'accessKeyId': 'a', '#secretAccessKey': 'a'}})), true);
    });
  });
});

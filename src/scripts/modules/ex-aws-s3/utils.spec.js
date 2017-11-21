var assert = require('assert');
var Immutable = require('immutable');
var createConfiguration = require('./utils').createConfiguration;
var parseConfiguration = require('./utils').parseConfiguration;

const emptyLocalState = {};
const emptyConfiguration = {};

const emptyLocalStateWithDefaults = {
  awsAccessKeyId: '',
  awsSecretAccessKey: ''
};
const emptyConfigurationWithDefauls = {
  parameters: {
    accessKeyId: '',
    '#secretAccessKey': ''
  }
};

const simpleLocalState = {
  awsAccessKeyId: 'awsAccessKeyId',
  awsSecretAccessKey: 'awsSecretAccessKey'
};
const simpleConfiguration = {
  parameters: {
    accessKeyId: 'awsAccessKeyId',
    '#secretAccessKey': 'awsSecretAccessKey'
  }
};

describe('utils', function() {
  describe('#createConfiguration()', function() {
    it('should return an empty config with defaults from an empty local state', function() {
      assert.deepEqual(emptyConfigurationWithDefauls, createConfiguration(Immutable.fromJS(emptyLocalState), 'test'));
    });
    it('should return an empty config with defaults from a local state with defaults', function() {
      assert.deepEqual(emptyConfigurationWithDefauls, createConfiguration(Immutable.fromJS(emptyLocalStateWithDefaults), 'test'));
    });
    it('should return a valid config for a simple local state', function() {
      assert.deepEqual(simpleConfiguration, createConfiguration(Immutable.fromJS(simpleLocalState), 'test'));
    });
  });

  describe('#parseConfiguration()', function() {
    it('should return empty localState with defaults from empty configuration', function() {
      assert.deepEqual(emptyLocalStateWithDefaults, parseConfiguration(emptyConfiguration, 'test'));
    });
    it('should return empty localState with defaults from empty configuration with defaults', function() {
      assert.deepEqual(emptyLocalStateWithDefaults, parseConfiguration(emptyConfigurationWithDefauls, 'test'));
    });
    it('should return a correct simple localState', function() {
      assert.deepEqual(simpleLocalState, parseConfiguration(simpleConfiguration, 'test'));
    });
  });
});

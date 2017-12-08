var assert = require('assert');
var Immutable = require('immutable');
var createConfiguration = require('./row').createConfiguration;
var parseConfiguration = require('./row').parseConfiguration;
// var diff = require('deep-diff').diff;
var cases = require('./row.spec.def').cases;

describe('row', function() {
  describe('#createConfiguration()', function() {
    it('should return an empty config with defaults from an empty local state', function() {
      const created = createConfiguration(Immutable.fromJS(cases.empty.localState));
      assert.deepEqual(cases.emptyWithDefaults.configuration, created);
    });
    it('should return an empty config with defaults from a local state with defaults', function() {
      const created = createConfiguration(Immutable.fromJS(cases.emptyWithDefaults.localState));
      assert.deepEqual(cases.emptyWithDefaults.configuration, created);
    });
    it('should return a valid config for a simple local state', function() {
      const created = createConfiguration(Immutable.fromJS(cases.simple.localState));
      assert.deepEqual(cases.simple.configuration, created);
    });
    it('should return a valid config for a local state with wildcard', function() {
      const created = createConfiguration(Immutable.fromJS(cases.wildcard.localState));
      assert.deepEqual(cases.wildcard.configuration, created);
    });
    it('should return a valid config for a local state with subfolders', function() {
      const created = createConfiguration(Immutable.fromJS(cases.subfolders.localState));
      assert.deepEqual(cases.subfolders.configuration, created);
    });
    it('should return a valid config for a local state with incremental', function() {
      const created = createConfiguration(Immutable.fromJS(cases.incremental.localState));
      assert.deepEqual(cases.incremental.configuration, created);
    });
    it('should return a valid config for a local state with newFilesOnly', function() {
      const created = createConfiguration(Immutable.fromJS(cases.newFilesOnly.localState));
      assert.deepEqual(cases.newFilesOnly.configuration, created);
    });
    it('should return a valid config for a local state with primaryKey', function() {
      const created = createConfiguration(Immutable.fromJS(cases.primaryKey.localState));
      assert.deepEqual(cases.primaryKey.configuration, created);
    });
    it('should return a valid config for a local state with delimiter', function() {
      const created = createConfiguration(Immutable.fromJS(cases.delimiter.localState));
      assert.deepEqual(cases.delimiter.configuration, created);
    });
    it('should return a valid config for a local state with tabDelimiter', function() {
      const created = createConfiguration(Immutable.fromJS(cases.tabDelimiter.localState));
      assert.deepEqual(cases.tabDelimiter.configuration, created);
    });
    it('should return a valid config for a local state with enclosure', function() {
      const created = createConfiguration(Immutable.fromJS(cases.enclosure.localState));
      assert.deepEqual(cases.enclosure.configuration, created);
    });
    it('should return a valid config for a local state with manualColumns', function() {
      const created = createConfiguration(Immutable.fromJS(cases.manualColumns.localState));
      assert.deepEqual(cases.manualColumns.configuration, created);
    });
    it('should return a valid config for a local state with autoColumns', function() {
      const created = createConfiguration(Immutable.fromJS(cases.autoColumns.localState));
      assert.deepEqual(cases.autoColumns.configuration, created);
    });
    it('should return a valid config for a local state with headerColumns', function() {
      const created = createConfiguration(Immutable.fromJS(cases.headerColumns.localState));
      assert.deepEqual(cases.headerColumns.configuration, created);
    });
    it('should return a valid config for a local state with decompress', function() {
      const created = createConfiguration(Immutable.fromJS(cases.decompress.localState));
      assert.deepEqual(cases.decompress.configuration, created);
    });

  });

  describe('#parseConfiguration()', function() {
    it('should return empty localState with defaults from empty configuration', function() {
      const parsed = parseConfiguration(cases.empty.configuration);
      assert.deepEqual(cases.emptyWithDefaults.localState, parsed);
    });
    it('should return empty localState with defaults from empty configuration with defaults', function() {
      assert.deepEqual(cases.emptyWithDefaults.localState, parseConfiguration(cases.emptyWithDefaults.configuration));
    });
    it('should return a correct simple localState', function() {
      assert.deepEqual(cases.simple.localState, parseConfiguration(cases.simple.configuration));
    });
    it('should return a correct localState with wildcard', function() {
      assert.deepEqual(cases.wildcard.localState, parseConfiguration(cases.wildcard.configuration));
    });
    it('should return a correct localState with subfolders', function() {
      assert.deepEqual(cases.subfolders.localState, parseConfiguration(cases.subfolders.configuration));
    });
    it('should return a correct localState with incremental', function() {
      assert.deepEqual(cases.incremental.localState, parseConfiguration(cases.incremental.configuration));
    });
    it('should return a correct localState with newFilesOnly', function() {
      assert.deepEqual(cases.newFilesOnly.localState, parseConfiguration(cases.newFilesOnly.configuration));
    });
    it('should return a correct localState with primaryKey', function() {
      assert.deepEqual(cases.primaryKey.localState, parseConfiguration(cases.primaryKey.configuration));
    });
    it('should return a correct localState with delimiter', function() {
      assert.deepEqual(cases.delimiter.localState, parseConfiguration(cases.delimiter.configuration));
    });
    it('should return a correct localState with tabDelimiter', function() {
      assert.deepEqual(cases.tabDelimiter.localState, parseConfiguration(cases.tabDelimiter.configuration));
    });
    it('should return a correct localState with enclosure', function() {
      assert.deepEqual(cases.enclosure.localState, parseConfiguration(cases.enclosure.configuration));
    });
    it('should return a correct localState with manualColumns', function() {
      assert.deepEqual(cases.manualColumns.localState, parseConfiguration(cases.manualColumns.configuration));
    });
    it('should return a correct localState with autoColumns', function() {
      assert.deepEqual(cases.autoColumns.localState, parseConfiguration(cases.autoColumns.configuration));
    });
    it('should return a correct localState with headerColumns', function() {
      assert.deepEqual(cases.headerColumns.localState, parseConfiguration(cases.headerColumns.configuration));
    });
    it('should return a correct localState with decompress', function() {
      assert.deepEqual(cases.decompress.localState, parseConfiguration(cases.decompress.configuration));
    });

  });
});

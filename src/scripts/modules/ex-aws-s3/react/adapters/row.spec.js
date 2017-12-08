var assert = require('assert');
var Immutable = require('immutable');
var createConfiguration = require('./row').createConfiguration;
var parseConfiguration = require('./row').parseConfiguration;
// var diff = require('deep-diff').diff;

const empty = {
  localState: {},
  configuration: {}
};

const emptyWithDefaults = {
  localState: {
    bucket: '',
    key: '',
    name: '',
    wildcard: false,
    subfolders: false,
    incremental: false,
    primaryKey: [],
    delimiter: ',',
    enclosure: '"',
    columns: [],
    columnsFrom: 'manual'
  },
  configuration: {
    parameters: {
      bucket: '',
      key: '',
      saveAs: '',
      includeSubfolders: false,
      newFilesOnly: false
    },
    processors: {
      after: [
        {
          definition: {
            component: 'keboola.processor-move-files'
          },
          parameters: {
            direction: 'tables',
            addCsvSuffix: true
          }
        },
        {
          definition: {
            component: 'keboola.processor-create-manifest'
          },
          parameters: {
            delimiter: ',',
            enclosure: '"',
            incremental: false,
            primary_key: [],
            columns: []
          }
        }
      ]
    }
  }
};

const simple = {
  localState: {
    bucket: 'mybucket',
    key: 'mykey',
    name: 'mytable',
    wildcard: false,
    subfolders: false,
    incremental: false,
    primaryKey: ['col1'],
    delimiter: ',',
    enclosure: '"',
    columns: ['col1', 'col2'],
    columnsFrom: 'manual'
  },
  configuration: {
    parameters: {
      bucket: 'mybucket',
      key: 'mykey',
      saveAs: 'mytable',
      includeSubfolders: false,
      newFilesOnly: false
    },
    processors: {
      after: [
        {
          definition: {
            component: 'keboola.processor-move-files'
          },
          parameters: {
            direction: 'tables',
            addCsvSuffix: true
          }
        },
        {
          definition: {
            component: 'keboola.processor-create-manifest'
          },
          parameters: {
            delimiter: ',',
            enclosure: '"',
            incremental: false,
            primary_key: ['col1'],
            columns: ['col1', 'col2']
          }
        }
      ]
    }
  }
};

describe('row', function() {
  describe('#createConfiguration()', function() {
    it('should return an empty config with defaults from an empty local state', function() {
      const created = createConfiguration(Immutable.fromJS(empty.localState));
      assert.deepEqual(emptyWithDefaults.configuration, created);
    });
    it('should return an empty config with defaults from a local state with defaults', function() {
      const created = createConfiguration(Immutable.fromJS(emptyWithDefaults.localState));
      assert.deepEqual(emptyWithDefaults.configuration, created);
    });
    it('should return a valid config for a simple local state', function() {
      const created = createConfiguration(Immutable.fromJS(simple.localState));
      assert.deepEqual(simple.configuration, created);
    });
  });

  describe('#parseConfiguration()', function() {
    it('should return empty localState with defaults from empty configuration', function() {
      const parsed = parseConfiguration(empty.configuration);
      assert.deepEqual(emptyWithDefaults.localState, parsed);
    });
    it('should return empty localState with defaults from empty configuration with defaults', function() {
      assert.deepEqual(emptyWithDefaults.localState, parseConfiguration(emptyWithDefaults.configuration));
    });
    it('should return a correct simple localState', function() {
      assert.deepEqual(simple.localState, parseConfiguration(simple.configuration));
    });
  });
});

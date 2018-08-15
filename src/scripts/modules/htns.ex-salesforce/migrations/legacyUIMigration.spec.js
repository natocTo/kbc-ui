import assert from 'assert';
import Immutable from 'immutable';
import legacyUIMigration from './legacyUIMigration';

describe('legacyUIMigration', function() {
  describe('isMigrated()', function() {
    it('should return a true for a migrated config', function() {
      assert.strictEqual(true, legacyUIMigration.isMigrated(Immutable.fromJS({
        configuration: {
          parameters: {
            loginname: '',
            '#password': '',
            '#securitytoken': '',
            'sandbox': ''
          }
        }
      })));
    });
    it('should return false for a config with objects key', function() {
      assert.strictEqual(false, legacyUIMigration.isMigrated(Immutable.fromJS({
        configuration: {
          parameters: {
            objects: []
          }
        }
      })));
    });
    it('should return false for a config with sinceLast key', function() {
      assert.strictEqual(false, legacyUIMigration.isMigrated(Immutable.fromJS({
        configuration: {
          parameters: {
            sinceLast: false
          }
        }
      })));
    });
  });

  describe('getRootConfiguration()', function() {
    it('should return correct defaults for an empty config', function() {
      const expected = {
        parameters: {
          loginname: '',
          '#password': '',
          '#securitytoken': '',
          sandbox: false
        }
      };
      assert.deepStrictEqual(expected, legacyUIMigration.getRootConfiguration(Immutable.fromJS({configuration: {}})).toJS());
    });
    it('should return correct config for a populated config', function() {
      const configuration = {
        configuration: {
          parameters: {
            loginname: 'a',
            '#password': 'b',
            '#securitytoken': 'c',
            sandbox: true,
            sinceLast: true,
            objects: []
          }
        }
      };
      const expected = {
        parameters: {
          loginname: 'a',
          '#password': 'b',
          '#securitytoken': 'c',
          sandbox: true
        }
      };
      assert.deepStrictEqual(expected, legacyUIMigration.getRootConfiguration(Immutable.fromJS(configuration)).toJS());
    });
  });

  describe('getRootState()', function() {
    it('should return empty state defaults for an empty state', function() {
      assert.deepStrictEqual({}, legacyUIMigration.getRootState(Immutable.fromJS({state: {}})).toJS());
    });
    it('should return correct value for a populated state', function() {
      const configuration = {
        state: {key: 'val'}
      };
      assert.deepStrictEqual(configuration.state, legacyUIMigration.getRootState(Immutable.fromJS(configuration)).toJS());
    });
  });

  describe('getRowsCount()', function() {
    it('should return 0 for missing objects prop', function() {
      assert.strictEqual(0, legacyUIMigration.getRowsCount(Immutable.fromJS({configuration: {}})));
    });
    it('should return 0 for empty objects prop', function() {
      assert.strictEqual(0, legacyUIMigration.getRowsCount(Immutable.fromJS({configuration: {parameters: {objects: []}}})));
    });
    it('should return 2 for 2 objects', function() {
      assert.strictEqual(2, legacyUIMigration.getRowsCount(Immutable.fromJS({configuration: {parameters: {objects: [{}, {}]}}})));
    });
  });


  describe('getRowName()', function() {
    it('should return correct defaults for a missing name', function() {
      const configuration = {
        configuration: {
          parameters: {
            objects: [{}, {}]
          }
        }
      };
      assert.strictEqual('Unknown object', legacyUIMigration.getRowName(Immutable.fromJS(configuration), 0));
      assert.strictEqual('Unknown object', legacyUIMigration.getRowName(Immutable.fromJS(configuration), 1));
    });
    it('should return correct name for a populated config', function() {
      const configuration = {
        configuration: {
          parameters: {
            objects: [
              {
                name: 'Account',
                soql: ''
              },
              {
                name: 'User',
                soql: 'SELECT Id, Name FROM User'
              }
            ]
          }
        }
      };
      assert.strictEqual('Account', legacyUIMigration.getRowName(Immutable.fromJS(configuration), 0));
      assert.strictEqual('User', legacyUIMigration.getRowName(Immutable.fromJS(configuration), 1));
    });
  });

  describe('getRowConfiguration()', function() {
    it('should return correct defaults for an empty config', function() {
      const configuration = {
        configuration: {
          parameters: {
            objects: [{}, {}]
          }
        }
      };
      const expected = {
        parameters: {
          sinceLast: false,
          objects: [
            {
              name: '',
              soql: ''
            }
          ]
        }
      };
      assert.deepStrictEqual(expected, legacyUIMigration.getRowConfiguration(Immutable.fromJS(configuration), 0).toJS());
      assert.deepStrictEqual(expected, legacyUIMigration.getRowConfiguration(Immutable.fromJS(configuration), 1).toJS());
    });
    it('should return correct config for a populated config', function() {
      const configuration = {
        configuration: {
          parameters: {
            sinceLast: true,
            objects: [
              {
                name: 'Account',
                soql: ''
              },
              {
                name: 'User',
                soql: 'SELECT Id, Name FROM User'
              }
            ]
          }
        }
      };
      const expected0 = {
        parameters: {
          sinceLast: true,
          objects: [
            {
              name: 'Account',
              soql: ''
            }
          ]
        }
      };
      const expected1 = {
        parameters: {
          sinceLast: true,
          objects: [
            {
              name: 'User',
              soql: 'SELECT Id, Name FROM User'
            }
          ]
        }
      };
      assert.deepStrictEqual(expected0, legacyUIMigration.getRowConfiguration(Immutable.fromJS(configuration), 0).toJS());
      assert.deepStrictEqual(expected1, legacyUIMigration.getRowConfiguration(Immutable.fromJS(configuration), 1).toJS());
    });
  });

  describe('getRowState()', function() {
    it('should return empty state defaults for an empty state', function() {
      assert.deepStrictEqual({}, legacyUIMigration.getRowState(Immutable.fromJS({state: {}}), 0).toJS());
      assert.deepStrictEqual({}, legacyUIMigration.getRowState(Immutable.fromJS({state: {}}), 1).toJS());
    });
    it('should return correct value for a populated state', function() {
      const configuration = {
        state: {key: 'val'}
      };
      assert.deepStrictEqual(configuration.state, legacyUIMigration.getRowState(Immutable.fromJS(configuration), 0).toJS());
      assert.deepStrictEqual(configuration.state, legacyUIMigration.getRowState(Immutable.fromJS(configuration), 1).toJS());
    });
  });
});

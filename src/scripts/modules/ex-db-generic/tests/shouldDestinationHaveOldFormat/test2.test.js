let assert = require('assert');

jest.mock('../../../../modules/components/stores/InstalledComponentsStore', () => {
  const Immutable = require('immutable');
  const data = Immutable.fromJS({
    parameters: {
      tables: [
        {
          outputTable: 'in.c-keboola-ex-db-mysql.test1'
        },
        {
          outputTable: 'in.c-keboola-ex-db-mysql.test2'
        }
      ]
    }
  });
  return {
    getConfigData: () => {
      return data;
    },
    getLocalState: () => {
      return data;
    }
  };
});

const store = require('../../storeProvisioning').createStore('keboola.ex-db-mysql', '333289236222');

describe('shouldDestinationHaveOldFormat test 2', function() {
  describe('shouldDestinationHaveOldFormat', function() {
    it('it should have old format (only old tables)', function() {
      assert.equal(
        store.shouldDestinationHaveOldFormat('in.c-keboola-ex-db-mysql'),
        true
      );
    });
  });
});

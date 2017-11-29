let assert = require('assert');

jest.mock('../../../../modules/components/stores/InstalledComponentsStore', () => {
  const Immutable = require('immutable');
  const data = Immutable.fromJS({
    parameters: {
      tables: []
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

describe('shouldDestinationHaveOldFormat test 1', function() {
  describe('shouldDestinationHaveOldFormat', function() {
    it('it should have new format (no tables)', function() {
      assert.equal(
        store.shouldDestinationHaveOldFormat('in.c-keboola-ex-db-mysql'),
        false
      );
    });
  });
});

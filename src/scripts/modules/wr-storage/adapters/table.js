import Immutable from 'immutable';

const createConfiguration = function(localState) {
  const config = Immutable.fromJS({
    storage: {
      input: {
        tables: [
          {
            source: localState.get('source', ''),
            destination: localState.get('destination', '')
          }
        ]
      }
    }
  });
  return config;
};

const parseConfiguration = function(configuration) {
  return Immutable.fromJS({
    source: configuration.getIn(['storage', 'input', 'tables', 0, 'source'], ''),
    destination: configuration.getIn(['storage', 'input', 'tables', 0, 'destination'], '')
  });
};

const createEmptyLocalState = function(tableId) {
  const tableName = tableId.substr(tableId.lastIndexOf('.') + 1);
  return Immutable.fromJS({source: tableId, destination: tableName});
};

export default {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration,
  createEmptyLocalState: createEmptyLocalState
};

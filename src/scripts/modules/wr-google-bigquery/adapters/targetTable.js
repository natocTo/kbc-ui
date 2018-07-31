import Immutable from 'immutable';

const createConfiguration = function(localState) {
  const config = Immutable.fromJS({
    storage: {
      input: {
        tables: [
          {
            source: localState.get('source', '')
          }
        ]
      }
    },
    parameters: {
      tables: [
        {
          dbName: localState.get('destination', ''),
          tableId: localState.get('source', '')
        }
      ]
    }
  });
  return config;
};

const parseConfiguration = function(configuration) {
  return Immutable.fromJS({
    destination: configuration.getIn(['parameters', 'tables', 0, 'dbName'], ''),
    source: configuration.getIn(['storage', 'input', 'tables', 0, 'source'], '')
  });
};

const createEmptyConfiguration = function(tableId) {
  const tableName = tableId.substr(tableId.lastIndexOf('.') + 1);
  return createConfiguration(Immutable.fromJS({destination: tableName, source: tableId}));
};

export default {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration,
  createEmptyConfiguration: createEmptyConfiguration
};

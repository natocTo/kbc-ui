import Immutable from 'immutable';

const createConfiguration = function(localState) {
  const config = Immutable.fromJS({
    storage: {
      input: {
        tables: [
          {
            source: localState.get('table', '')
          }
        ]
      }
    },
    parameters: {
      tables: [
        {
          dbName: localState.get('name', ''),
          tableId: localState.get('table', '')
        }
      ]
    }
  });
  return config;
};

const parseConfiguration = function(configuration) {
  return Immutable.fromJS({
    name: configuration.getIn(['parameters', 'tables', 0, 'dbName'], ''),
    table: configuration.getIn(['storage', 'input', 'tables', 0, 'source'], '')
  });
};

const createEmptyConfiguration = function(tableId) {
  const tableName = tableId.substr(tableId.lastIndexOf('.') + 1);
  return createConfiguration(Immutable.fromJS({name: tableName, table: tableId}));
};

export default {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration,
  createEmptyConfiguration: createEmptyConfiguration
};

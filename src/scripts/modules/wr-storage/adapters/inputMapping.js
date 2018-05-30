import Immutable from 'immutable';

const createConfiguration = function(localState) {
  const config = Immutable.fromJS({
    storage: {
      input: {
        tables: [
          {
            source: localState.get('source', ''),
            changed_since: localState.get('changedSince', '')
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
    changedSince: configuration.getIn(['storage', 'input', 'tables', 0, 'changed_since'], '')
  });
};

const createEmptyConfiguration = function(tableId) {
  return createConfiguration(Immutable.fromJS({source: tableId}));
};

export default {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration,
  createEmptyConfiguration: createEmptyConfiguration
};

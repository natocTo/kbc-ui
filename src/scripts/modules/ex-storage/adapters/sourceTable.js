import Immutable from 'immutable';

const createConfiguration = function(localState) {
  const config = Immutable.fromJS({
    parameters: {
      tableName: localState.get('source', ''),
      changedSince: localState.get('changedSince', '')
    }
  });
  return config;
};

const parseConfiguration = function(configuration) {
  return Immutable.fromJS({
    source: configuration.getIn(['parameters', 'tableName'], ''),
    changedSince: configuration.getIn(['parameters', 'changedSince'], '')
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

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

const createEmptyLocalState = function(tableId) {
  return Immutable.fromJS({source: tableId});
};

const normalizeConfiguration = function(configuration) {
  let normalized = configuration;
  normalized = normalized.setIn(
    ['storage', 'input', 'tables', 0, 'changed_since'],
    configuration.getIn(['storage', 'input', 'tables', 0, 'changed_since'], '')
  );
  return normalized;
};

export default {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration,
  createEmptyLocalState: createEmptyLocalState,
  normalizeConfiguration: normalizeConfiguration
};

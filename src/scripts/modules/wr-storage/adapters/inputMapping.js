import Immutable from 'immutable';

const createConfiguration = function(localState) {
  const config = Immutable.fromJS({
    storage: {
      input: {
        tables: [
          {
            source: localState.get('source', ''),
            destination: localState.get('destination', ''),
            columns: localState.get('columns', Immutable.List()).toJS(),
            where_column: localState.get('whereColumn', ''),
            where_values: localState.get('whereValues', Immutable.List()).toJS(),
            where_operator: localState.get('whereOperator', 'eq'),
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
    destination: configuration.getIn(['storage', 'input', 'tables', 0, 'destination'], ''),
    columns: configuration.getIn(['storage', 'input', 'tables', 0, 'columns'], Immutable.List()),
    whereColumn: configuration.getIn(['storage', 'input', 'tables', 0, 'where_column'], ''),
    whereValues: configuration.getIn(['storage', 'input', 'tables', 0, 'where_values'], Immutable.List()),
    whereOperator: configuration.getIn(['storage', 'input', 'tables', 0, 'where_operator'], 'eq'),
    changedSince: configuration.getIn(['storage', 'input', 'tables', 0, 'changed_since'], '')
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

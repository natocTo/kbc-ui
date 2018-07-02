import { Map, fromJS } from 'immutable';

export function createConfiguration(localState) {
  return fromJS({
    parameters: {
      'master_host': localState.get('host'),
      'master_user': localState.get('user'),
      '#master_password': localState.get('password'),
      'master_database': localState.get('database'),
      'warehouse': localState.get('warehouse')
    }
  });
}

export function parseConfiguration(configuration) {
  const params = configuration.get('parameters', Map());
  return fromJS({
    host: params.get('master_host', ''),
    user: params.get('master_user', ''),
    password: params.get('#master_password', ''),
    database: params.get('master_database', ''),
    warehouse: params.get('warehouse', '')
  });
}

export function isComplete(configuration) {
  return (
    configuration.getIn(['parameters', 'master_host'], '') !== ''
    && configuration.getIn(['parameters', 'master_user'], '') !== ''
    && configuration.getIn(['parameters', '#master_password'], '') !== ''
    && configuration.getIn(['parameters', 'master_database'], '') !== ''
    && configuration.getIn(['parameters', 'warehouse'], '') !== ''
  );
}

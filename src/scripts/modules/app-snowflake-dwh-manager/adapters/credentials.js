import Immutable, {fromJS, Map} from 'immutable';

export function createConfiguration(localState) {
  const config = Immutable.fromJS({
    parameters: {
      'master_host': localState.get('host'),
      'master_user': localState.get('user'),
      '#master_password': localState.get('password'),
      'master_database': localState.get('database'),
      'warehouse': localState.get('warehouse')
    }
  });
  return config;
}

export function parseConfiguration(configuration) {
  const params = configuration.get('parameters', Map());
  const localState = fromJS({
    host: params.get('master_host', ''),
    user: params.get('master_user', ''),
    password: params.get('#master_password', ''),
    database: params.get('master_database', ''),
    warehouse: params.get('warehouse', '')
  });
  return localState;
}

export function isComplete(configuration) {
  return configuration.getIn(['parameters', 'master_host'], '') !== '';
}

import Immutable from 'immutable';

export function createConfiguration(localState) {
  const config = Immutable.fromJS({
    parameters: {
      loginname: localState.get('login', ''),
      '#password': localState.get('password', ''),
      '#securitytoken': localState.get('securityToken', ''),
      'sandbox': localState.get('sandbox', false)
    }
  });
  return config;
}

export function parseConfiguration(configuration) {
  return Immutable.fromJS({
    login: configuration.getIn(['parameters', 'loginname'], ''),
    password: configuration.getIn(['parameters', '#password'], ''),
    securityToken: configuration.getIn(['parameters', '#securitytoken'], ''),
    sandbox: configuration.getIn(['parameters', 'sandbox'], false)
  });
}

export function isComplete(configuration) {
  return configuration.getIn(['parameters', 'loginname'], '') !== '' &&
    configuration.getIn(['parameters', '#password'], '') !== '' &&
    configuration.getIn(['parameters', '#securitytoken'], '') !== '';
}


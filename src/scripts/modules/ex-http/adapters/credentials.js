import Immutable from 'immutable';

export function createConfiguration(localState) {
  const config = Immutable.fromJS({
    parameters: {
      baseUrl: localState.get('baseUrl', '')
    }
  });
  return config;
}

export function parseConfiguration(configuration) {
  return Immutable.fromJS({
    baseUrl: configuration.getIn(['parameters', 'baseUrl'], '')
  });
}

export function isComplete(configuration) {
  return configuration.getIn(['parameters', 'baseUrl'], '') !== '';
}

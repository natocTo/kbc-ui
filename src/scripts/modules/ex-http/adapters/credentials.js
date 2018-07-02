import Immutable from 'immutable';

export function createConfiguration(localState) {
  const config = Immutable.fromJS({
    parameters: {
      baseUrl: localState.get('baseUrl', '')
    }
  });
  const maxRedirects = localState.get('maxRedirects', '');
  if (maxRedirects !== '') {
    return config.setIn(['parameters', 'maxRedirects'], maxRedirects);
  }
  return config;
}

export function parseConfiguration(configuration) {
  return Immutable.fromJS({
    baseUrl: configuration.getIn(['parameters', 'baseUrl'], ''),
    maxRedirects: configuration.getIn(['parameters', 'maxRedirects'], '')
  });
}

export function isComplete(configuration) {
  return configuration.getIn(['parameters', 'baseUrl'], '') !== '';
}

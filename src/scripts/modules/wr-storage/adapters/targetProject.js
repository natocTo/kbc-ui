import Immutable from 'immutable';

export function createConfiguration(localState) {
  const config = Immutable.fromJS({
    parameters: {
      url: localState.get('url', ''),
      '#token': localState.get('token', ''),
      bucket: localState.get('bucket', ''),
    }
  });
  return config;
}

export function parseConfiguration(configuration) {
  return Immutable.fromJS({
    url: configuration.getIn(['parameters', 'url'], ''),
    token: configuration.getIn(['parameters', '#token'], ''),
    bucket: configuration.getIn(['parameters', 'bucket'], '')
  });
}

export function isComplete(configuration) {
  return configuration.getIn(['parameters', 'url'], '') !== ''
    && configuration.getIn(['parameters', '#token'], '') !== ''
    && configuration.getIn(['parameters', 'bucket'], '') !== ''
    ;
}

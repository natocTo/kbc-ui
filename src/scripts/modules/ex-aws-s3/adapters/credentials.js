import Immutable from 'immutable';

export function createConfiguration(localState) {
  const config = Immutable.fromJS({
    parameters: {
      accessKeyId: localState.get('awsAccessKeyId', ''),
      '#secretAccessKey': localState.get('awsSecretAccessKey', '')
    }
  });
  return config;
}

export function parseConfiguration(configuration) {
  return Immutable.fromJS({
    awsAccessKeyId: configuration.getIn(['parameters', 'accessKeyId'], ''),
    awsSecretAccessKey: configuration.getIn(['parameters', '#secretAccessKey'], '')
  });
}

export function isComplete(configuration) {
  return configuration.getIn(['parameters', 'accessKeyId'], '') !== '' && configuration.getIn(['parameters', '#secretAccessKey'], '') !== '';
}


var Immutable = require('immutable');
function createConfiguration(localState) {
  const config = Immutable.fromJS({
    parameters: {
      accessKeyId: localState.get('awsAccessKeyId', ''),
      '#secretAccessKey': localState.get('awsSecretAccessKey', '')
    }
  });
  return config;
}

function parseConfiguration(configuration) {
  return Immutable.fromJS({
    awsAccessKeyId: configuration.getIn(['parameters', 'accessKeyId'], ''),
    awsSecretAccessKey: configuration.getIn(['parameters', '#secretAccessKey'], '')
  });
}

module.exports = {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration
};

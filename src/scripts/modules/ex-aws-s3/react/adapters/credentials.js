var Immutable = require('immutable');
function createConfiguration(localState) {
  const config = {
    parameters: {
      accessKeyId: localState.get('awsAccessKeyId', ''),
      '#secretAccessKey': localState.get('awsSecretAccessKey', '')
    }
  };
  return config;
}

function parseConfiguration(configuration) {
  const configData = Immutable.fromJS(configuration);
  return {
    awsAccessKeyId: configData.getIn(['parameters', 'accessKeyId'], ''),
    awsSecretAccessKey: configData.getIn(['parameters', '#secretAccessKey'], '')
  };
}

module.exports = {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration
};

var Immutable = require('immutable');
function createConfiguration(localState) {
  const config = Immutable.fromJS({
    parameters: {
      baseUrl: localState.get('baseUrl', '')
    }
  });
  return config;
}

function parseConfiguration(configuration) {
  return Immutable.fromJS({
    baseUrl: configuration.getIn(['parameters', 'baseUrl'], '')
  });
}

function isComplete(configuration) {
  return configuration.getIn(['parameters', 'baseUrl'], '') !== '';
}

module.exports = {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration,
  isComplete: isComplete
};

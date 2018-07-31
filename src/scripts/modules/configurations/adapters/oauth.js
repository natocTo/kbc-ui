import Immutable from 'immutable';

const createConfiguration = function(localState) {
  return Immutable.fromJS({
    authorization: {
      oauth_api: {
        id: localState.get('oauthId', '')
      }
    }
  });
};

const parseConfiguration = function(configuration, context) {
  return Immutable.fromJS({
    oauthId: configuration.getIn(['authorization', 'oauth_api', 'id'], ''),
    componentId: context.get('componentId', ''),
    configurationId: context.get('configurationId', '')
  });
};

const isComplete = function(configuration) {
  return configuration.hasIn(['authorization', 'oauth_api', 'id']) && !!configuration.getIn(['authorization', 'oauth_api', 'id']);
};

export default {
  createConfiguration: createConfiguration,
  parseConfiguration: parseConfiguration,
  isComplete: isComplete
};

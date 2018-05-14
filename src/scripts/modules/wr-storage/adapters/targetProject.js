import Immutable from 'immutable';

export default {
  createConfiguration: function(localState) {
    const config = Immutable.fromJS({
      parameters: {
        url: localState.get('url', ''),
        '#token': localState.get('token', ''),
        bucket: localState.get('bucket', '')
      }
    });
    return config;
  },

  parseConfiguration: function(configuration) {
    return Immutable.fromJS({
      url: configuration.getIn(['parameters', 'url'], ''),
      token: configuration.getIn(['parameters', '#token'], ''),
      bucket: configuration.getIn(['parameters', 'bucket'], '')
    });
  },

  isComplete: function(configuration) {
    return configuration.getIn(['parameters', 'url'], '') !== ''
      && configuration.getIn(['parameters', '#token'], '') !== ''
      && configuration.getIn(['parameters', 'bucket'], '') !== ''
      ;
  }
};

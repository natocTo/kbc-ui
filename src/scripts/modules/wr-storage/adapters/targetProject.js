import Immutable from 'immutable';

export default {
  createConfiguration: function(localState) {
    const config = Immutable.fromJS({
      parameters: {
        url: localState.get('url', ''),
        '#token': localState.get('token', '')
      }
    });
    return config;
  },

  parseConfiguration: function(configuration) {
    return Immutable.fromJS({
      url: configuration.getIn(['parameters', 'url'], ''),
      token: configuration.getIn(['parameters', '#token'], '')
    });
  },

  isComplete: function(configuration) {
    return configuration.getIn(['parameters', 'url'], '') !== ''
      && configuration.getIn(['parameters', '#token'], '') !== ''
    ;
  }
};

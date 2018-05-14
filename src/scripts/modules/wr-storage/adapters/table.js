import Immutable from 'immutable';

export default {
  createConfiguration: function(localState) {
    const config = Immutable.fromJS({
      storage: {
        input: {
          tables: [
            {
              source: localState.get('source', ''),
              destination: localState.get('destination', '')
            }
          ]
        }
      }
    });
    return config;
  },
  parseConfiguration: function(configuration) {
    return Immutable.fromJS({
      source: configuration.getIn(['storage', 'input', 'tables', 0, 'source'], ''),
      destination: configuration.getIn(['storage', 'input', 'tables', 0, 'destination'], '')
    });
  }
};

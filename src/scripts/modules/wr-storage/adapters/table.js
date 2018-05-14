import Immutable from 'immutable';

export function createConfiguration(localState) {
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
}

export function parseConfiguration(configuration) {
  return Immutable.fromJS({
    source: configuration.getIn(['storage', 'input', 'tables', 0, 'source'], ''),
    destination: configuration.getIn(['storage', 'input', 'tables', 0, 'destination'], '')
  });
}

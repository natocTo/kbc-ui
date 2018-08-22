import Immutable from 'immutable';

export function createConfiguration(localState) {
  return Immutable.fromJS({
    parameters: {
      sinceLast: localState.get('incremental', false),
      objects: [
        {
          name: localState.get('object', ''),
          soql: localState.get('query', '')
        }
      ]
    }
  });
}

export function parseConfiguration(configuration) {
  return Immutable.fromJS({
    object: configuration.getIn(['parameters', 'objects', 0, 'name'], ''),
    query: configuration.getIn(['parameters', 'objects', 0, 'soql'], ''),
    incremental: configuration.getIn(['parameters', 'sinceLast'], false)
  });
}

export function createEmptyConfiguration(name) {
  return createConfiguration(Immutable.fromJS({object: name}));
}

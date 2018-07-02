import Immutable from 'immutable';

export function createConfiguration(localState) {
  const destination = localState.get('destination', '');
  const prefix = destination.substr(0, destination.lastIndexOf('/') + 1);
  const filename = destination.substr(destination.lastIndexOf('/') + 1);
  const config = Immutable.fromJS({
    parameters: {
      prefix: prefix
    },
    storage: {
      input: {
        tables: [
          {
            source: localState.get('source', ''),
            destination: filename
          }
        ]
      }
    },
    processors: {
      before: [
        {
          definition: {
            component: 'keboola.processor-move-files'
          },
          parameters: {
            direction: 'files'
          }
        }
      ]
    }
  });
  return config;
}

export function parseConfiguration(configuration) {
  const prefix = configuration.getIn(['parameters', 'prefix'], '');
  const filename = configuration.getIn(['storage', 'input', 'tables', 0, 'destination'], '');
  return Immutable.fromJS({
    destination: prefix + filename,
    source: configuration.getIn(['storage', 'input', 'tables', 0, 'source'], '')
  });
}

export function createEmptyConfiguration(tableId) {
  return createConfiguration(Immutable.fromJS({source: tableId}));
}

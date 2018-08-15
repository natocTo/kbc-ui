import Immutable from 'immutable';

export function isMigrated(configuration) {
  if (configuration.hasIn(['configuration', 'parameters', 'objects']) || configuration.hasIn(['configuration', 'parameters', 'sinceLast'])) {
    return false;
  }
  return true;
}

export function getRootConfiguration(configuration) {
  return Immutable.fromJS({
    parameters: {
      loginname: configuration.getIn(['configuration', 'parameters', 'loginname'], ''),
      '#password': configuration.getIn(['configuration', 'parameters', '#password'], ''),
      '#securitytoken': configuration.getIn(['configuration', 'parameters', '#securitytoken'], ''),
      sandbox: configuration.getIn(['configuration', 'parameters', 'sandbox'], false)
    }
  });
}

export function getRootState(configuration) {
  return configuration.get('state', Immutable.Map());
}

export function getRowsCount(configuration) {
  const objects = configuration.getIn(['configuration', 'parameters', 'objects'], Immutable.List());
  return objects.size;
}

export function getRowName(configuration, index) {
  return configuration.getIn(['configuration', 'parameters', 'objects', index, 'name'], 'Unknown object');
}

export function getRowConfiguration(configuration, index) {
  return Immutable.fromJS({
    parameters: {
      sinceLast: configuration.getIn(['configuration', 'parameters', 'sinceLast'], false),
      objects: [
        {
          name: configuration.getIn(['configuration', 'parameters', 'objects', index, 'name'], ''),
          soql: configuration.getIn(['configuration', 'parameters', 'objects', index, 'soql'], '')
        }
      ]
    }
  });
}

export function getRowState(configuration) {
  return configuration.get('state', Immutable.Map());
}

export default {
  isMigrated,
  getRootConfiguration,
  getRootState,
  getRowsCount,
  getRowName,
  getRowConfiguration,
  getRowState
};

import {Map, fromJS} from 'immutable';
import {parseParameters, createConfigParameters, createInputMapping, parseInputMapping} from '../helpers/rowParametersTable';

const createConfiguration = (localState) => {
  const incrementalLoad = localState.get('incrementalLoad', 0);
  const storage = incrementalLoad > 0 ? createInputMapping(Map({changed_since: incrementalLoad})) : Map();
  const localStateToSave = localState.remove('hasFact').remove('incrementalLoad');
  return storage.merge(createConfigParameters(localStateToSave));
};

export default {
  createConfiguration: createConfiguration,

  parseConfiguration(configuration) {
    const parametersTable = parseParameters(configuration);
    const hasFact = !!parametersTable.get('columns', Map()).find(column => column.get('type') === 'fact');
    return Map({
      hasFact,
      tableId: parametersTable.get('tableId'),
      incrementalLoad: parseInputMapping(configuration).get('changed_since', 0),
      grain: parametersTable.get('grain', null)
    });
  },

  createEmptyConfiguration(name) {
    return createConfiguration(fromJS({tableId: name, grain: null, incrementalLoad: 0}));
  }
};

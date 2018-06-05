import {Map, fromJS} from 'immutable';
import {parseParameters, createConfigParameters} from '../helpers/rowParametersTable';

const createConfiguration = (localState) => {
  return createConfigParameters(localState.remove('hasFact'));
};

export default {
  createConfiguration: createConfiguration,

  parseConfiguration(configuration) {
    const parametersTable = parseParameters(configuration);
    const hasFact = !!parametersTable.get('columns', Map()).find(column => column.get('type') === 'fact');
    return Map({
      hasFact,
      tableId: parametersTable.get('tableId'),
      incrementalLoad: parametersTable.get('incrementalLoad', 0),
      grain: parametersTable.get('grain', null)
    });
  },

  createEmptyConfiguration(name) {
    return createConfiguration(fromJS({tableId: name, grain: null, incrementalLoad: 0}));
  }
};

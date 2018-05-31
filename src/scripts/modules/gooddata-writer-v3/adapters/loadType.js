import {Map, fromJS} from 'immutable';
import {parseParameters, createConfigParameters} from '../helpers/rowParametersTable';

export default {
  createConfiguration: (localState) => createConfigParameters(localState.remove('hasFact')),

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
    return fromJS({tableId: name, grain: null, incrementalLoad: 0});
  }
};

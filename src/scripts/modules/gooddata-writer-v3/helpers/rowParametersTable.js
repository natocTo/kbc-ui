import {Map, fromJS} from 'immutable';

export function parseParameters(configuration) {
  const params = configuration.getIn(['parameters', 'tables'], Map());
  const tableId = params.keySeq().first();
  return params.get(tableId, Map()).set('tableId', tableId);
}

const inputMappingPath = ['storage', 'input', 'tables'];

export function parseInputMapping(configuration) {
  return configuration.getIn(inputMappingPath.concat(0), Map());
}

export function createInputMapping(inputMapping) {
  return Map().setIn(inputMappingPath, fromJS([inputMapping]));
}

export function createConfigParameters(localState) {
  const tableId = localState.get('tableId');
  return fromJS({
    parameters: {
      tables: {
        [tableId]: localState.remove('tableId')
      }
    }
  });
}

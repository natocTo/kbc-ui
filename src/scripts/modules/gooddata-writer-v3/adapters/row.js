import {Map, fromJS} from 'immutable';
function createConfiguration(localState) {
  const tableId = localState.get('tableId');
  return fromJS({
    parameters: {
      tables: {
        [tableId]: localState.remove('tableId')
      }
    }
  }
  );
}

export default {
  createConfiguration,
  parseConfiguration(configuration) {
    const params = configuration.getIn(['parameters', 'tables'], Map());
    const tableId = params.keySeq().first();
    const tableParams = params.get(tableId, Map()).set('tableId', tableId);
    return tableParams;
  },
  createEmptyConfiguration(name, webalizedName) {
    const initState = {
      tableId: name,
      title: webalizedName,
      identifier: ''
    };
    return createConfiguration(fromJS(initState));
  }
};

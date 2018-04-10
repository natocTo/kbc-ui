import {Map, fromJS} from 'immutable';
function createConfiguration(localState) {
  const tableId = localState.get('tableId');
  const imColumns = localState.get('columns').keySeq().toList();
  return fromJS({
    storage: {
      input: {
        tables: [
          {
            source: tableId,
            columns: imColumns
          }
        ]
      }
    },
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
      identifier: '',
      incrementalLoad: 0,
      grain: null,
      columns: Map()
    };
    return createConfiguration(fromJS(initState));
  }
};

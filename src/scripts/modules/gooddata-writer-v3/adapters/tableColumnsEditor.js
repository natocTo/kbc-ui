import {Map, fromJS} from 'immutable';

export default {
  createConfiguration(localState) {
    const columns = localState.get('columns').filter(c => c.get('type') !== 'IGNORE');
    const result = columns.reduce((memo, column) => memo.set(column.get('id'), column.delete('id')), Map());
    return localState.set('columns', result);
  },

  parseConfiguration(configuration, tables) {
    const configColumns = configuration.get('columns', Map());
    const tableId = configuration.get('tableId');
    const storageTable = tables.get(tableId);
    const storageTableColumns = storageTable.get('columns');
    const deletedColumns = configColumns
      .filter((val, id)  => !storageTableColumns.find(c => c === id))
      .keySeq().toList();
    const allColumns = storageTableColumns.concat(deletedColumns);
    const defaultColumn = Map({type: 'IGNORE'});
    const columnsList = allColumns.map(c => configColumns
      .get(c, defaultColumn.set('title', c)).set('id', c)
    );
    return fromJS({columns: columnsList, tableId: tableId});
  },

  createEmptyConfiguration() {
    return fromJS({columns: []});
  }

};

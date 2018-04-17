import {fromJS} from 'immutable';

function prepareTableColumnsEditorSection(
  onLoadColumns,
  onSaveColumns,
  initColumnFn,
  columnsKey = 'columns',
  isColumnIgnored = column => column.get('type') === 'IGNORE',
  columnIdKey = 'id') {
  return {
    createConfiguration(localState) {
      const localStateColumnsToSave = localState.get(columnsKey).filter(c => !isColumnIgnored(c));
      return localState.set(columnsKey, onSaveColumns(localStateColumnsToSave));
    },

    parseConfiguration(configuration, tables) {
      const configColumns = onLoadColumns(configuration.get(columnsKey));
      const tableId = configuration.get('tableId');
      const storageTable = tables.get(tableId);
      const storageTableColumns = storageTable.get('columns');
      const deletedColumns = configColumns
        .filter(column =>
          !storageTableColumns.find(c => c === column.get(columnIdKey)));
      const allColumns = storageTableColumns.concat(deletedColumns);
      const columnsList = allColumns.map(c => configColumns.get(c, initColumnFn(c)));
      return fromJS({[columnsKey]: columnsList, tableId: tableId});
    },

    createEmptyConfiguration() {
      return fromJS({[columnsKey]: []});
    }
  };
}

export default  prepareTableColumnsEditorSection;

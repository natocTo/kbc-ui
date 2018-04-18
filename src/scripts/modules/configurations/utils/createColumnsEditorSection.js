import {fromJS} from 'immutable';
import StorageTableColumnsEditor from '../react/components/StorageTableColumnsEditor';

export default (params) => {
  if (!params) return null;
  const {onLoadColumns,
         onSaveColumns,
         initColumnFn,
         columnsKey = 'columns',
         columnIdKey = 'id',
         columnsMappings = [],
         isComplete = () => true,
         isColumnIgnored = column => column.get('type') === 'IGNORE'} = params;

  return fromJS({
    onSave(localState) {
      const localStateColumnsToSave = localState.get(columnsKey)
                                                .filter(c => !isColumnIgnored(c));
      return localState
        .set(columnsKey, onSaveColumns(localStateColumnsToSave))
        .delete('columnsMappings');
    },

    onLoad(configuration, tables) {
      const configColumns = onLoadColumns(configuration.get(columnsKey));
      const tableId = configuration.get('tableId');
      const storageTable = tables.get(tableId);
      const storageTableColumns = storageTable.get('columns');
      const deletedColumns = configColumns
        .filter(column =>
          !storageTableColumns.find(c => c === column.get(columnIdKey)));
      const allColumns = storageTableColumns.concat(deletedColumns);
      const columnsList = allColumns.map(c => configColumns.find(cc => cc.get('id') === c, null, initColumnFn(c)));
      return fromJS({[columnsKey]: columnsList, tableId: tableId, columnsMappings});
    },

    onCreate() {
      return fromJS({[columnsKey]: [], columnsMappings});
    },

    render: StorageTableColumnsEditor,
    isComplete: isComplete
  });
};

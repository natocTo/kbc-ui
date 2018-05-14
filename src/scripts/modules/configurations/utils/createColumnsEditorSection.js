import {fromJS} from 'immutable';
import StorageTableColumnsEditor from '../react/components/StorageTableColumnsEditor';

export default (params) => {
  if (!params) return null;
  const {
    onLoadColumns, // remap columns object/array stored in config to localstate array columnsObject => columnsArray
    onSaveColumns, // remap columns array from localstate to config representation (columnsArray) => columnsObject
    initColumnFn, // initial value of column given by its name (columnName) => columnObject
    columnsKey = 'columns', // property in config/localstate representing columns object/array
    matchColumnKey = 'id', // used for matching columns objects with storage table columns by its name (columnName, columnObject) => true/false
    columnsMappings = [], // array of object containing render and title property
    isComplete = () => true, // is representation complete?
    isColumnIgnored = column => column.get('type') === 'IGNORE'
  } = params; // if ignored then won't be saved to input mapping columns property of configuration object

  return fromJS({
    onSave(localState) {
      const localStateColumnsToSave = localState.get(columnsKey)
        .filter(column => !isColumnIgnored(column));
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
        .filter(configColumn =>
          !storageTableColumns.find(tableColumn => tableColumn === configColumn.get(matchColumnKey)));
      const allTableColumns = storageTableColumns.concat(deletedColumns);
      const columnsList = allTableColumns.map(
        tableColumn => configColumns.find(
          configColumn => configColumn.get(matchColumnKey) === tableColumn,
          null,
          initColumnFn(tableColumn)
        )
      );
      return fromJS({[columnsKey]: columnsList, tableId: tableId, columnsMappings});
    },

    onCreate() {
      return fromJS({[columnsKey]: [], columnsMappings});
    },

    render: StorageTableColumnsEditor,
    isComplete: isComplete
  });
};

import {fromJS} from 'immutable';
import StorageTableColumnsEditor from '../react/components/StorageTableColumnsEditor';

export default (params) => {
  const {
    onLoadColumns, // (configuration) => columnsArray. Parse columns from configuration object and return array of columns objects
    onSaveColumns, // (tableId, columnsList) => configuration_object. Return configuration object to save from given tableId and columnsList
    initColumnFn, // (columnName) => columnObject. Initial value of column given by its name
    parseTableId, // (configuration) => tableId. Parse tableId from configuration
    matchColumnKey = 'id', // used for matching columns objects with storage table columns by its name (columnName, columnObject) => true/false
    columnsMappings = [], // array of object containing render and title property
    isComplete = () => true, // is representation complete?
    isColumnIgnored = column => column.get('type') === 'IGNORE', // if ignored then won't be saved to input mapping columns property of configuration object
    prepareColumnContext = () => null // (table, sectionContext) => result of this fn will be injected as 'context' prop to every column render component
  } = params;

  const onSave = function(localState) {
    const tableId = localState.get('tableId');
    const localStateColumnsToSave = localState
      .get('columns').filter(column => !isColumnIgnored(column));
    const configParametersWithColumns = onSaveColumns(tableId, localStateColumnsToSave);
    const configStorageMapping = fromJS({
      storage: {
        input: {
          tables: [
            {
              source: tableId,
              columns: localStateColumnsToSave.map(column => column.get(matchColumnKey))
            }
          ]
        }
      }
    });
    return configStorageMapping.mergeDeep(configParametersWithColumns);
  };

  return fromJS({
    onSave,
    onLoad(configuration, sectionContext) {
      const tables = sectionContext.get('allTables');
      const configColumns = onLoadColumns(configuration);
      const tableId = parseTableId(configuration);
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
      const columnContext = prepareColumnContext(storageTable, sectionContext);
      return fromJS({columns: columnsList, tableId: tableId, columnsMappings, context: columnContext});
    },
    onCreate(name) {
      return onSave(fromJS({'columns': [], columnsMappings, tableId: name}));
    },
    render: StorageTableColumnsEditor,
    isComplete
  });
};

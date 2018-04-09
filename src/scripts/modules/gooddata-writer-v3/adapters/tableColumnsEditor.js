import {Map, List} from 'immutable';
import TablesStore from '../../components/stores/StorageTablesStore';


export default {
  createConfiguration(localState) {
    const columns = localState.get('columns').filter(c => c.get('type') !== 'IGNORE');
    const result = columns.reduce((memo, column) => memo.set(column.get('id'), column.delete('id')), Map());
    return localState.set('columns', result);
  },

  parseConfiguration(configuration) {
    const configColumns = configuration.get('columns', Map()),
      tableId = configuration.get('tableId');
    const storageTable = TablesStore.getAll().get(tableId) || List();
    const storageTableColumns = storageTable.get('columns');
    const deletedColumns = configColumns
      .filter((val, id)  => !storageTableColumns.find(c => c === id))
      .keySeq().toList();
    const allColumns = storageTableColumns.concat(deletedColumns);
    const defaultColumn = Map({type: 'IGNORE'});
    const columnsList = allColumns.map(c => configColumns
      .get(c, defaultColumn.set('title', c)).set('id', c)
    );
    return Map().set('columns', columnsList);
  }

};

import {Map, fromJS} from 'immutable';
import {parseParameters, createConfigParameters} from '../helpers/rowParametersTable';

// import TitleColumnInput from '../react/components/TitleColumnInput';
// import ColumnType from '../react/components/ColumnType';
import ColumnSetup from '../react/components/ColumnSetup';
import {prepareColumnContext} from '../helpers/ColumnDefinition';


export default {
  initColumnFn: columnName => Map({id: columnName, type: 'IGNORE', title: columnName}),
  parseTableId: (configuration) => parseParameters(configuration).get('tableId'),
  matchColumnKey: 'id',
  isColumnIgnored: column => column.get('type') === 'IGNORE',
  onSaveColumns: (tableId, columnsList) => {
    const columnsObject = columnsList.reduce((memo, column) =>
      memo.set(column.get('id'), column.delete('id')), Map());
    return createConfigParameters(fromJS({tableId, columns: columnsObject}));
  },
  onLoadColumns: (configuration) => {
    const configColumns = parseParameters(configuration).get('columns', Map());
    return configColumns
      .map((column, id) => column.set('id', id))
      .valueSeq().toList();
  },
  prepareColumnContext: prepareColumnContext,
  columnsMappings: [
    {
      title: 'Preferences',
      render: ColumnSetup

    }
  ],
  isComplete: () => true
};

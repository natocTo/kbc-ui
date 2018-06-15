import {Map, fromJS} from 'immutable';
import {parseParameters, createConfigParameters} from '../helpers/rowParametersTable';
import PreferencesHeader from '../react/components/PreferencesHeader';
import PreferencesColumn from '../react/components/PreferencesColumn';
import {prepareColumnContext, initHeaderState} from '../helpers/ColumnDefinition';
import ColumnDefinition from '../helpers/ColumnDefinition';


export default {
  isColumnValidFn: (column) => !ColumnDefinition(column).getInvalidReason(),
  initColumnFn: columnName => Map(ColumnDefinition({id: columnName}).initColumn()),
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
  initHeaderStateFn: initHeaderState,
  columnsMappings: [
    {
      title: PreferencesHeader,
      render: PreferencesColumn

    }
  ],
  isComplete: () => true
};

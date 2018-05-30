import {Map, fromJS} from 'immutable';
import {parseParameters, createConfigParameters} from '../helpers/rowParametersTable';

import TitleColumnInput from '../react/components/TitleColumnInput';
import TypeColumn from '../react/components/TypeColumn';


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
  columnsMappings: [
    {
      title: 'GoodData Title',
      render: TitleColumnInput
    },
    {
      title: 'Type',
      render: TypeColumn
    }
  ],
  isComplete: () => true
};

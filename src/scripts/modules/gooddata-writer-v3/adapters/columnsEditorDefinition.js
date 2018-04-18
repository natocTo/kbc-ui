import {Map} from 'immutable';

import TitleColumnInput from '../react/components/TitleColumnInput';
import TypeColumn from '../react/components/TypeColumn';


export default {
  initColumnFn: columnName => Map({id: columnName, type: 'IGNORE', title: columnName}),
  columnsKey: 'columns',
  matchColumnKey: 'id',
  isColumnIgnored: column => column.get('type') === 'IGNORE',
  onSaveColumns: (columnsList) =>
    columnsList.reduce((memo, column) =>
      memo.set(column.get('id'), column.delete('id')), Map()),
  onLoadColumns: (configColumns) =>
    (configColumns || Map())
      .map((column, id) => column.set('id', id))
      .valueSeq().toList(),
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

import {List, Map} from 'immutable';
// import {parseParameters, createConfigParameters} from './rowParametersTable';
// import PreferencesHeader from '../react/components/PreferencesHeader';
import PreferencesColumn from '../react/components/PreferencesColumn';
import makeColumnDefinition from './makeColumnDefinition';

export default {
  initColumnFn: columnName => Map(makeColumnDefinition({name: columnName}).initColumn()),
  matchColumnKey: 'name',
  isColumnIgnored: column => column.get('type') === 'IGNORE',
  onSaveColumns: (tableId, columnsList) => {
    return columnsList;
  },
  onLoadColumns: (configuration) => {
    return configuration.getIn(['parameters', 'tables', 0, 'items'], List());
  },
  prepareColumnContext: function(sectionContext) {
    return sectionContext;
  },
  columnsMappings: [
    {
      // title: PreferencesHeader,
      render: PreferencesColumn

    }
  ],
  isComplete: () => true
};

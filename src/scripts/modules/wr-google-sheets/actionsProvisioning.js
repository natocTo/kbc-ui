import storeProvisioning from './storeProvisioning';
import _ from 'underscore';
import {fromJS, List, Map} from 'immutable';
import InstalledComponentStore from '../components/stores/InstalledComponentsStore';
import componentsActions from '../components/InstalledComponentsActionCreators';
import callDockerAction from '../components/DockerActionsApi';

export default function(COMPONENT_ID, configId) {
  const store = storeProvisioning(COMPONENT_ID, configId);

  // returns localState for @path and function to update local state
  // on @path+@subPath
  function prepareLocalState(path) {
    const ls = store.getLocalState(path);
    const updateLocalSubstateFn = (subPath, newData)  =>  {
      if (_.isEmpty(subPath)) {
        return updateLocalState([].concat(path), newData);
      } else {
        return updateLocalState([].concat(path).concat(subPath), newData);
      }
    };
    return {
      localState: ls,
      updateLocalState: updateLocalSubstateFn,
      prepareLocalState: (newSubPath) => prepareLocalState([].concat(path).concat(newSubPath))
    };
  }

  function updateLocalState(path, data) {
    const ls = store.getLocalState();
    const newLocalState = ls.setIn([].concat(path), data);
    componentsActions.updateLocalState(COMPONENT_ID, configId, newLocalState, path);
  }

  function saveConfigData(data, waitingPath, changeDescription) {
    updateLocalState(waitingPath, true);
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, data, changeDescription)
      .then(() => updateLocalState(waitingPath, false));
  }

  function getConfigData() {
    return InstalledComponentStore.getConfigData(COMPONENT_ID, configId) || Map();
  }

  function generateId() {
    const existingIds = store.tables.map((q) => q.get('id'));
    const randomNumber = () => Math.floor((Math.random() * 100000) + 1);
    let newId = randomNumber();
    while (existingIds.indexOf(newId) >= 0) {
      newId = randomNumber();
    }
    return newId;
  }

  function touchSheet() {
    return fromJS({
      'id': generateId(),
      'action': 'update',
      'sheetTitle': 'Sheet1',
      'enabled': true
    });
  }

  function saveTables(tables, savingPath, description) {
    const inputTables = tables.map((t) => {
      return Map()
        .set('source', t.get('tableId'))
        .set('destination', t.get('tableId') + '.csv');
    });

    const desc = description || 'Update tables';
    const data = store.configData
      .setIn(['parameters', 'tables'], tables)
      .setIn(['storage', 'input', 'tables'], inputTables)
    ;
    return saveConfigData(data, savingPath, desc);
  }

  function saveTable(table) {
    // create spreadsheet if not exist
    if (!table.get('fileId')) {
      updateLocalState(store.getSavingPath(table.get('id')), true);
      return createSpreadsheet(table).then(
        (data) => {
          const newTable = table
            .set('fileId', data.spreadsheet.spreadsheetId)
            .set('sheetId', data.spreadsheet.sheets[0].properties.sheetId);
          return updateTable(newTable);
        }
      );
    } else {
      return updateTable(table);
    }
  }

  function updateTable(table) {
    const tid = table.get('id');
    let found = false;
    let newTables = store.tables.map((t) => {
      if (t.get('id') === tid) {
        found = true;
        return table;
      } else {
        return t;
      }
    });
    if (!found) {
      newTables = newTables.push(table);
    }

    return saveTables(newTables, store.getSavingPath(tid), `Update table ${tid}`);
  }

  function deleteTable(table) {
    const newTables = store.tables.filter((t) => t.get('id') !== table.get('id'));
    return saveTables(newTables, store.getSavingPath(table.get('id')), `Update table ${table.get('tableId')}`);
  }

  function toggleEnabled(table) {
    return updateTable(table.set('enabled', !table.get('enabled')));
  }

  function createSpreadsheet(table) {
    const configData = getConfigData();
    let runData = configData
      .setIn(['parameters', 'tables'], List().push(table))
      .delete('storage')
    ;

    const params = {
      configData: runData.toJS()
    };
    return callDockerAction(COMPONENT_ID, 'createSpreadsheet', params);
  }

  return {
    prepareLocalState: prepareLocalState,
    updateLocalState: updateLocalState,
    generateId: generateId,
    touchSheet: touchSheet,
    saveTables: saveTables,
    saveTable: saveTable,
    deleteTable: deleteTable,
    toggleEnabled: toggleEnabled
  };
}

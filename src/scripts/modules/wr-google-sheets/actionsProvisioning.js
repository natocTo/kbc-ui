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

  function saveTables(tables, mappings, savingPath, description) {
    const desc = description || 'Update tables';
    const data = store.configData
      .setIn(['parameters', 'tables'], tables)
      .setIn(['storage', 'input', 'tables'], mappings)
    ;
    return saveConfigData(data, savingPath, desc);
  }

  function saveTable(table, mapping) {
    updateLocalState(store.getSavingPath(table.get('id')), true);
    if (!table.get('fileId')) {
      // create spreadsheet if not exist
      return createSpreadsheet(table).then((data) => {
        return updateTable(
          table
            .set('fileId', data.spreadsheet.spreadsheetId)
            .set('sheetId', data.spreadsheet.sheets[0].properties.sheetId),
          mapping
        );
      });
    } else if (!table.get('sheetId')) {
      // add new sheet, when importing to existing spreadsheet
      return addSheet(table).then((data) => {
        return updateTable(
          table.set('sheetId', data.sheet.sheetId),
          mapping
        );
      });
    }
    return updateTable(table, mapping);
  }

  function updateTable(table, mapping) {
    const tid = table.get('id');
    let found = false;
    let newTables = store.tables.map((t) => {
      if (t.get('id') === tid) {
        found = true;
        return table;
      }
      return t;
    });
    if (!found) {
      newTables = newTables.push(table);
    }

    let foundMapping = false;
    const filterMappings = store.mappings.filter((t) => typeof t === 'object');
    let newMappings = filterMappings.map((t) => {
      if (mapping && typeof t === 'object' && t.get('source') === mapping.get('source')) {
        foundMapping = true;
        return mapping;
      }
      return t;
    });
    if (!foundMapping && mapping) {
      newMappings = newMappings.push(mapping);
    }

    return saveTables(newTables, newMappings, store.getSavingPath(tid), `Update table ${tid}`);
  }

  function deleteTable(table) {
    const newTables = store.tables.filter((t) => t.get('id') !== table.get('id'));
    const newMappings = store.mappings.filter((t) => t.get('source') !== table.get('tableId'));
    return saveTables(newTables, newMappings, store.getSavingPath(table.get('id')), `Update table ${table.get('tableId')}`);
  }

  function toggleEnabled(table) {
    const pendingPath = store.getPendingPath(table.get('id'));
    updateLocalState(pendingPath, true);
    return updateTable(table.set('enabled', !table.get('enabled')))
      .then(() => updateLocalState(pendingPath, false));
  }

  function createSpreadsheet(table) {
    const configData = getConfigData();
    let runData = configData
      .setIn(['parameters', 'tables'], List().push(table))
      .delete('storage');

    const params = {
      configData: runData.toJS()
    };
    return callDockerAction(COMPONENT_ID, 'createSpreadsheet', params);
  }

  function addSheet(table) {
    const configData = getConfigData();
    let runData = configData
      .setIn(['parameters', 'tables'], List().push(table))
      .delete('storage');

    const params = {
      configData: runData.toJS()
    };
    return callDockerAction(COMPONENT_ID, 'addSheet', params);
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

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
    let dataToSave = data;
    updateLocalState(waitingPath, true);
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, dataToSave, changeDescription)
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
      'tableId': '',
      'title': '',
      'action': 'update',
      'spreadsheet': '',
      'folder': ''
    });
  }

  function saveTables(newTables, savingPath, description) {
    const desc = description || 'Update tables';
    const data = store.configData.setIn(['parameters', 'tables'], newTables);
    return saveConfigData(data, savingPath, desc);
  }

  function saveTable(table) {
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
    return saveTables(newTables, store.getSavingPath(tid), `Update table ${table.get('tableId')}`);
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

  function startEditing(what, initValue = null) {
    const path = store.getEditPath(what);
    updateLocalState(path, initValue);
  }

  function updateEditing(what, value) {
    const path = store.getEditPath(what);
    updateLocalState(path, value);
  }

  function cancelEditing(what) {
    const data = store.editData.delete(what);
    updateLocalState(store.getEditPath(null), data);
  }

  return {
    updateEditing: updateEditing,
    startEditing: startEditing,
    cancelEditing: cancelEditing,
    prepareLocalState: prepareLocalState,
    updateLocalState: updateLocalState,
    generateId: generateId,
    touchSheet: touchSheet,
    saveTables: saveTables,
    saveTable: saveTable,
    createSpreadsheet: createSpreadsheet
  };
}

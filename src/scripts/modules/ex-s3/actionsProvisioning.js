import Immutable from 'immutable';

import storeProvisioning from './storeProvisioning';
import componentsActions from '../components/InstalledComponentsActionCreators';
import installedComponentsStore from '../components/stores/InstalledComponentsStore';
import storageTablesStore from '../components/stores/StorageTablesStore';

// utils
import {createConfiguration} from './utils';

const COMPONENT_ID = 'keboola.ex-s3';

export default function(configId) {
  const store = storeProvisioning(configId);
  function updateLocalState(path, data) {
    const ls = installedComponentsStore.getLocalState(COMPONENT_ID, configId);
    const newLocalState = ls.setIn([].concat(path), data);
    componentsActions.updateLocalState(COMPONENT_ID, configId, newLocalState, path);
  }

  function removeFromLocalState(path) {
    const ls = installedComponentsStore.getLocalState(COMPONENT_ID, configId);
    const newLocalState = ls.deleteIn([].concat(path));
    componentsActions.updateLocalState(COMPONENT_ID, configId, newLocalState, path);
  }

  function getLocalState() {
    return installedComponentsStore.getLocalState(COMPONENT_ID, configId);
  }

  function editReset() {
    removeFromLocalState(['settings']);
    removeFromLocalState(['isChanged']);
    removeFromLocalState(['isDestinationEditing']);
  }

  function editChange(field, newValue) {
    let settings = store.settings;
    if (field === 'destination') {
      const tables = storageTablesStore.getAll();
      // set primary key if table exists
      const oldDestination = settings.get('destination');
      if (tables.has(newValue) && !tables.has(oldDestination)) {
        settings = settings.set('primaryKey', tables.getIn([newValue, 'primaryKey']));
      }
      if (!tables.has(newValue) && tables.has(oldDestination)) {
        settings = settings.set('primaryKey', Immutable.List());
      }
      settings = settings.set('destination', newValue);
    } else {
      settings = settings.set(field, newValue);
    }
    updateLocalState(['settings'], settings);
    if (!getLocalState().get('isChanged', false)) {
      updateLocalState(['isChanged'], true);
    }
  }

  function destinationEdit() {
    updateLocalState(['isDestinationEditing'], true);
    if (!getLocalState().get('isChanged', false)) {
      updateLocalState(['isChanged'], true);
    }
  }

  function editSave() {
    const localState = getLocalState();
    const config = Immutable.fromJS(createConfiguration(localState.get('settings', Immutable.Map()), configId));
    removeFromLocalState(['isDestinationEditing']);
    updateLocalState(['isSaving'], true);
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, config).then(() => {
      removeFromLocalState(['settings']);
      removeFromLocalState(['isSaving']);
      removeFromLocalState(['isChanged']);
    });
  }

  return {
    editReset,
    editSave,
    editChange,
    destinationEdit
  };
}

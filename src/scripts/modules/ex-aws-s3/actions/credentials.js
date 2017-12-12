import Immutable from 'immutable';

import storeProvisioning from '../stores/credentials';
import componentsActions from '../../components/InstalledComponentsActionCreators';
import installedComponentsStore from '../../components/stores/InstalledComponentsStore';

// utils
import {createConfiguration} from '../adapters/credentials';

const COMPONENT_ID = 'keboola.ex-aws-s3';

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
    removeFromLocalState(['credentials']);
    removeFromLocalState(['isChanged']);
  }

  function editChange(field, newValue) {
    let credentials = store.credentials;
    credentials = credentials.set(field, newValue);
    updateLocalState(['credentials'], credentials);
    if (!getLocalState().get('isChanged', false)) {
      updateLocalState(['isChanged'], true);
    }
  }

  function editSave() {
    const localState = getLocalState();
    const config = createConfiguration(localState.get('credentials', Immutable.Map()), configId);
    updateLocalState(['isSaving'], true);
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, config).then(() => {
      removeFromLocalState(['credentials']);
      removeFromLocalState(['isSaving']);
      removeFromLocalState(['isChanged']);
    });
  }

  return {
    editReset,
    editSave,
    editChange
  };
}

import Immutable from 'immutable';

import {createConfiguration} from './utils';
import installedComponentsStore from '../components/stores/InstalledComponentsStore';
import callDockerAction from '../components/DockerActionsApi';
import componentsActions from '../components/InstalledComponentsActionCreators';
import storeProvisioning from './storeProvisioning';

// utils
const COMPONENT_ID = 'keboola.ex-pigeon';

export default function(configId) {
  const store = storeProvisioning(configId);

  function updateLocalState(path, data) {
    const ls = installedComponentsStore.getLocalState(COMPONENT_ID, configId);
    const newLocalState = ls.setIn([].concat(path), data);
    componentsActions.updateLocalState(COMPONENT_ID, configId, newLocalState, path);
  }

  function getLocalState() {
    return installedComponentsStore.getLocalState(COMPONENT_ID, configId);
  }

  function removeFromLocalState(path) {
    const ls = installedComponentsStore.getLocalState(COMPONENT_ID, configId);
    const newLocalState = ls.deleteIn([].concat(path));
    componentsActions.updateLocalState(COMPONENT_ID, configId, newLocalState, path);
  }

  function editReset() {
    removeFromLocalState(['settings']);
    removeFromLocalState(['isChanged']);
  }

  function editChange(field, newValue) {
    let settings = store.settings;
    settings = settings.set(field, newValue);
    updateLocalState(['settings'], settings);
    if (!getLocalState().get('isChanged', false)) {
      updateLocalState(['isChanged'], true);
    }
  }

  function editSave() {
    const localState = getLocalState();
    const config = Immutable.fromJS(createConfiguration(localState.get('settings', Immutable.Map()), configId));
    updateLocalState(['isSaving'], true);
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, config).then(() => {
      removeFromLocalState(['settings']);
      removeFromLocalState(['isSaving']);
      removeFromLocalState(['isChanged']);
    });
  }

  return {
    updateLocalState: updateLocalState,
    requestEmail() {
      return callDockerAction(COMPONENT_ID, 'get',  `{"configData": {"parameters": {"config": "${configId}"}}}`).then((result) => {
        updateLocalState('requestedEmail', result.email);
      });
    },
    editReset: editReset,
    editSave: editSave,
    editChange: editChange
  };
}
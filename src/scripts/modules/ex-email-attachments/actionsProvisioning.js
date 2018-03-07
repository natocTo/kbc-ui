import {Map} from 'immutable';

import installedComponentsStore from '../components/stores/InstalledComponentsStore';
import callDockerAction from '../components/DockerActionsApi';
import componentsActions from '../components/InstalledComponentsActionCreators';
import storeProvisioning from './storeProvisioning';

// utils
const COMPONENT_ID = 'keboola.ex-email-attachments';

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
    const config = store.configData.set('parameters', store.settings);
    updateLocalState(['isSaving'], true);
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, config, 'Update parameters').then(() => {
      removeFromLocalState(['settings']);
      removeFromLocalState(['isSaving']);
      removeFromLocalState(['isChanged']);
    });
  }

  function saveConfigData(data, changeDescription) {
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, data, changeDescription);
  }

  function generateDefaultParameters(email) {
    return Map({
      'email': email,
      'delimiter': ',',
      'enclosure': '"',
      'primaryKey': [],
      'incremental': false
    });
  }

  function requestEmailAndInitConfig() {
    const email = store.requestedEmail;
    if (!email) {
      return callDockerAction(COMPONENT_ID, 'get', {configData: {parameters: {config: configId}}})
        .then((result) => {
          if (result.status === 'error') {
            updateLocalState('error', result);
          } else {
            const config = store.configData.set('parameters', generateDefaultParameters(result.email));
            return saveConfigData(config, 'Setup email');
          }
        }).catch((error) => updateLocalState('error', error));
    }
  }

  return {
    updateLocalState: updateLocalState,
    requestEmailAndInitConfig: requestEmailAndInitConfig,
    editReset: editReset,
    editSave: editSave,
    editChange: editChange
  };
}

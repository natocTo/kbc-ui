import callDockerAction from '../components/DockerActionsApi';
import componentsActions from '../components/InstalledComponentsActionCreators';
import storeProvisioning from './storeProvisioning';
import {Map} from 'immutable';

// utils
const COMPONENT_ID = 'keboola.ex-pigeon';

export default function(configId) {
  const store = storeProvisioning(configId);

  function updateLocalState(path, data) {
    const ls = store.getLocalState();
    const newLocalState = ls.setIn([].concat(path), data);
    componentsActions.updateLocalState(COMPONENT_ID, configId, newLocalState, path);
  }

  function updateDirtyParameters(field, value) {
    const newDirtyParameters =  store.dirtyParameters.set(field, value);
    updateLocalState('dirtyParameters', newDirtyParameters);
  }

  function resetDirtyParameters() {
    const defaultParameters =  store.configData.get('parameters');
    updateLocalState('dirtyParameters', defaultParameters);
  }

  function saveConfigData() {
    const dataToSave = new Map([['parameters', store.dirtyParameters]]);
    updateLocalState('isSaving', true);
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, dataToSave, 'update parameters').then(() => {
      updateLocalState('isSaving', false);
    });
  }

  return {
    updateLocalState: updateLocalState,
    requestEmail() {
      return callDockerAction(COMPONENT_ID, 'get',  `{"configData": {"parameters": {"config": "${configId}"}}}`).then((result) => {
        updateLocalState('requestedEmail', result.email);
      });
    },
    updateDirtyParameters: updateDirtyParameters,
    resetDirtyParameters,
    saveConfigData: saveConfigData
  };
}
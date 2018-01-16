import callDockerAction from '../components/DockerActionsApi';
import componentsActions from '../components/InstalledComponentsActionCreators';
import _ from 'underscore';
import storeProvisioning from './storeProvisioning';


// utils
const COMPONENT_ID = 'keboola.ex-pigeon';

export default function(configId) {
  const store = storeProvisioning(configId);

  function updateLocalState(path, data) {
    const ls = store.getLocalState();
    const newLocalState = ls.setIn([].concat(path), data);
    componentsActions.updateLocalState(COMPONENT_ID, configId, newLocalState, path);
  }

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

  function updateDirtyParameters(field, value) {
    const newDirtyParameters =  store.dirtyParameters.set(field, value);
    updateLocalState('dirtyParameters', newDirtyParameters);
  }

  function resetDirtyParameters() {
    const defaultParameters =  store.configData.get('parameters');
    updateLocalState('dirtyParameters', defaultParameters);
  }

  function saveDirtyParameters() {
    updateLocalState('isSaving', true);
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, store.dirtyParameters).then(() => {
      updateLocalState('isSaving', false);
      // resetDirtyParameters();
    });
  }

  return {
    updateLocalState: updateLocalState,
    prepareLocalState: prepareLocalState,
    requestEmail() {
      return callDockerAction(COMPONENT_ID, 'get',  `{"configData": {"parameters": {"config": "${configId}"}}}`).then((result) => {
        updateLocalState('requestedEmail', result.email);
      });
    },
    updateDirtyParameters,
    resetDirtyParameters,
    saveDirtyParameters
  };
}
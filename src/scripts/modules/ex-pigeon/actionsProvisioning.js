import callDockerAction from '../components/DockerActionsApi';
import componentsActions from '../components/InstalledComponentsActionCreators';
import _ from 'underscore';
import storeProvisioning from './storeProvisioning';

const COMPONENT_ID = 'keboola.ex-pigeon';

export default function(configId) {
  const store = storeProvisioning(configId);

  function updateLocalState(path, data) {
    const ls = store.getLocalState();
    const newLocalState = ls.setIn([].concat(path), data);
    console.log('updating local state', path);
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

  return {
    updateLocalState: updateLocalState,
    prepareLocalState: prepareLocalState,
    requestEmail() {
      return callDockerAction(COMPONENT_ID, 'get', '{"configData": {"parameters": {"config": "test"}}}').then((result) => {
        updateLocalState('requestedEmail', result.email);
        updateLocalState('isLoading', false);
      });
    }
  };
}
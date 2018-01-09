import storeProvisioning from './storeProvisioning';
import componentsActions from '../components/InstalledComponentsActionCreators';
import _ from 'underscore';

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
    console.log(ls);
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


  function saveConfigData(data, waitingPath, changeDescription) {
    // check default output bucket and save default if non set
    updateLocalState(waitingPath, true);
    return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, data, changeDescription).then(() => updateLocalState(waitingPath, false));
  }

  function saveParameters(newParams) {
    const data = store.configData.set('parameters', newParams);
    return saveConfigData(data, 'saving', 'Setup crawler');
  }

  return {
    updateLocalState: updateLocalState,
    prepareLocalState: prepareLocalState,
    saveParams: saveParameters

  };
}

import storeProvisioning from './storeProvisioning';
import componentsActions from '../components/InstalledComponentsActionCreators';

const COMPONENT_ID = 'apify.apify';
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


  /* function saveConfigData(data, waitingPath, changeDescription) {
   *   let dataToSave = data;
   *   // check default output bucket and save default if non set
   *   const ob = dataToSave.getIn(['parameters', 'outputBucket']);
   *   if (!ob) {
   *     dataToSave = dataToSave.setIn(['parameters', 'outputBucket'], common.getDefaultBucket(COMPONENT_ID, configId));
   *   }

   *   updateLocalState(waitingPath, true);
   *   return componentsActions.saveComponentConfigData(COMPONENT_ID, configId, dataToSave, changeDescription)
   *                           .then(() => updateLocalState(waitingPath, false));
   * }*/

  return {
    updateLocalState: updateLocalState,
    prepareLocalState: prepareLocalState
  };
}

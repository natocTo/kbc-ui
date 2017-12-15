import {List} from 'immutable';

import InstalledComponentStore from '../components/stores/InstalledComponentsStore';
import RoutesStore from '../../stores/RoutesStore';
import componentsActions from '../components/InstalledComponentsActionCreators';

import storeProvisioning from './storeProvisioning';
import {connectionTestedPath} from './storeProvisioning';
import {getProtectedProperties} from './templates/credentials';

export default function(componentId) {
  function getLocalState(configId) {
    return InstalledComponentStore.getLocalState(componentId, configId);
  }

  function updateLocalState(configId, path, data) {
    const ls = getLocalState(configId);
    const newLocalState = ls.setIn([].concat(path), data);
    componentsActions.updateLocalState(componentId, configId, newLocalState, path);
  }

  function removeFromLocalState(configId, path) {
    const ls = getLocalState(configId);
    const newLocalState = ls.deleteIn([].concat(path));
    componentsActions.updateLocalState(componentId, configId, newLocalState, path);
  }

  function updateProtectedProperties(newCredentials, oldCredentials) {
    const props = getProtectedProperties(componentId);
    const propsList = List(props);

    return propsList.reduce((memo, prop) => {
      const newValue = newCredentials.get(prop);
      const oldValue = oldCredentials.get(prop);
      if (!newValue) {
        return memo.set(prop, oldValue);
      }
      return memo;
    }, newCredentials);
  }

  function saveConfigData(configId, data, waitingPath, changeDescription) {
    updateLocalState(configId, waitingPath, true);
    return componentsActions.saveComponentConfigData(componentId, configId, data, changeDescription)
      .then(() => updateLocalState(configId, waitingPath, false));
  }

  return {
    updateEditingCredentials(configId, newCredentials) {
      updateLocalState(configId, 'editingCredentials', newCredentials);
      if (!getLocalState(configId).get('isChangedCredentials', false)) {
        updateLocalState(configId, connectionTestedPath, false); // @todo ?
        updateLocalState(configId, ['isChangedCredentials'], true);
      }
    },
    cancelCredentialsEdit(configId) {
      removeFromLocalState(configId, ['isChangedCredentials']);
      removeFromLocalState(configId, ['editingCredentials']);
    },
    saveEditingCredentials(configId) {
      const store = storeProvisioning(componentId, configId);
      let credentials = store.getEditingCredentials();
      updateProtectedProperties(credentials, store.getCredentials());
      const newConfigData = store.configData.setIn(['parameters', 'db'], credentials);
      const diffMsg = 'Update credentials';
      return saveConfigData(configId, newConfigData, ['isSavingCredentials'], diffMsg).then(() => {
        this.cancelCredentialsEdit(configId);
        updateLocalState(configId, connectionTestedPath, false); // @todo ?
        RoutesStore.getRouter().transitionTo(componentId, {config: configId});
      });
    }
  };
}

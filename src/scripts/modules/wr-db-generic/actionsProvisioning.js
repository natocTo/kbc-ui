import _ from 'underscore';

import {Map, List} from 'immutable';

import InstalledComponentStore from '../components/stores/InstalledComponentsStore';
import RoutesStore from '../../stores/RoutesStore';
import componentsActions from '../components/InstalledComponentsActionCreators';

import callDockerAction from '../components/DockerActionsApi';

import storeProvisioning from './storeProvisioning';
import provisioningUtils from './provisioningUtils';
import {connectionTestedPath} from './storeProvisioning';
import {getProtectedProperties} from './templates/credentials';
import provisioningTemplate from './templates/provisioning';

function convertProvCredentialsToEditing(credentials, driver) {
  let newCredentials, len, i;
  const template = provisioningTemplate(driver);
  const fieldsMapping = template.fieldsMapping;
  const ref = _.keys(fieldsMapping);

  newCredentials = Map();
  for (i = 0, len = ref.length; i < len; i++) {
    let key = ref[i];
    newCredentials = newCredentials.set(key, credentials.get(fieldsMapping[key]));
  }
  newCredentials = newCredentials.set('port', parseInt(template.defaultPort, 10));
  newCredentials = newCredentials.set('driver', driver);
  return newCredentials;
}

export default function(componentId, driver) {
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
    toggleBucket(configId, bucketId) {
      const newValue = !getLocalState(configId).getIn(['bucketToggles', bucketId], false);
      updateLocalState(configId, ['bucketToggles', bucketId], newValue);
    },
    enableSplash(configId) {
      updateLocalState(configId, 'isSplashEnabled', true);
    },
    disableSplash(configId) {
      updateLocalState(configId, 'isSplashEnabled', false);
    },
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
    prepareCredentials(configId) {
      updateLocalState(configId, 'isSavingCredentials', true);
      provisioningUtils(componentId, driver).getCredentials(configId).then(function(credentials) {
        updateLocalState(configId, 'isSavingCredentials', false);
        const store = storeProvisioning(componentId, configId);
        const newCredentials = convertProvCredentialsToEditing(credentials, driver);
        const newConfigData = store.configData.setIn(['parameters', 'db'], newCredentials);
        const diffMsg = 'Provisioned credentials';

        return saveConfigData(configId, newConfigData, ['isSavingCredentials'], diffMsg).then(() => {
          updateLocalState(configId, connectionTestedPath, false); // @todo ?
          updateLocalState(configId, 'isSplashEnabled', false);
          RoutesStore.getRouter().transitionTo(componentId + '-credentials', {config: configId});
        });
      });
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
    },
    testCredentials(configId, credentials) {
      const store = storeProvisioning(componentId, configId);
      const configData = store.configData;
      const storedCredentials = configData.getIn(['parameters', 'db']);
      const testingCredentials = updateProtectedProperties(credentials, storedCredentials);
      let runData = configData
        .setIn(['parameters', 'tables'], List())
        .delete('storage');

      runData = runData.setIn(['parameters', 'db'], testingCredentials);
      const params = {
        configData: runData.toJS()
      };
      return callDockerAction(componentId, 'testConnection', params);
    },
    setTablesFilter(configId, query) {
      updateLocalState(configId, 'tablesFilter', query);
    },
    quickstartSelected(configId, selected) {
      updateLocalState(configId, ['quickstart', 'tables'], selected);
    }
  };
}

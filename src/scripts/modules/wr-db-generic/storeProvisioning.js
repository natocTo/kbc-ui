import InstalledComponentStore from '../components/stores/InstalledComponentsStore';

import {Map} from 'immutable';

export default function(componentId, configId) {
  const config = InstalledComponentStore.getConfigData(componentId, configId);
  const parameters = config.get('parameters', Map());
  const localState =  InstalledComponentStore.getLocalState(componentId, configId);

  return {
    getCredentials() {
      return parameters.get('db', Map());
    },

    hasCredentials() {
      return parameters.has('db');
    },

    getLocalState() {
      return localState;
    }
  };
}
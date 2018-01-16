const COMPONENT_ID = 'keboola.ex-pigeon';

import {Map} from 'immutable';
import _ from 'underscore';
import InstalledComponentStore from '../components/stores/InstalledComponentsStore';

export const storeMixins = [InstalledComponentStore];

export default function(configId) {
  const localState = () => InstalledComponentStore.getLocalState(COMPONENT_ID, configId) || Map();
  const configData =  InstalledComponentStore.getConfigData(COMPONENT_ID, configId) || Map();
  const dirtyParameters = localState().get('dirtyParameters', configData.get('parameters'));
  return {
    configData: configData,
    requestedEmail: localState().get('requestedEmail'),
    dirtyParameters: dirtyParameters,
    getLocalState(path) {
      if (_.isEmpty(path)) {
        return localState() || Map();
      }
      return localState().getIn([].concat(path), Map());
    }

  };
}

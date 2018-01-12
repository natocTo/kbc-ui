const COMPONENT_ID = 'keboola.ex-pigeon';

import {Map} from 'immutable';
import InstalledComponentStore from '../components/stores/InstalledComponentsStore';

export const storeMixins = [InstalledComponentStore];

export default function(configId) {
  const configData =  InstalledComponentStore.getConfigData(COMPONENT_ID, configId) || Map();
  return {
    configData: configData
  };
}

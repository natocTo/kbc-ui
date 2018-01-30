const COMPONENT_ID = 'keboola.ex-pigeon';
import {Map} from 'immutable';
import _ from 'underscore';
import InstalledComponentStore from '../components/stores/InstalledComponentsStore';
export const storeMixins = [InstalledComponentStore];

export default function(configId) {
  var settings;
  let localState = InstalledComponentStore.getLocalState(COMPONENT_ID, configId);
  const configData =  InstalledComponentStore.getConfigData(COMPONENT_ID, configId);

  settings = localState.get('settings', configData.get('parameters', Map()));

  return {
    settings: settings,
    configData: configData,
    requestingEmail: localState.get('requestingEmail', false),
    requestedEmail: settings.get('email'),
    getLocalState(path) {
      if (_.isEmpty(path)) {
        return localState || Map();
      }
      return localState.getIn([].concat(path), Map());
    }
  };
}

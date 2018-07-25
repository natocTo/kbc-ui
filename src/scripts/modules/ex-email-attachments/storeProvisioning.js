const COMPONENT_ID = 'keboola.ex-email-attachments';
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
    processors: JSON.stringify(configData.get('processors', Map().toJS()), ' ', 2),
    configData: configData,
    error: localState.get('error'),
    requestedEmail: settings.get('email'),
    getLocalState(path) {
      if (_.isEmpty(path)) {
        return localState || Map();
      }
      return localState.getIn([].concat(path), Map());
    }
  };
}

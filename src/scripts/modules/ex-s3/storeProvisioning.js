import Immutable from 'immutable';
import _ from 'underscore';

import InstalledComponentStore from '../components/stores/InstalledComponentsStore';
import {parseConfiguration} from './utils';

const COMPONENT_ID = 'keboola.ex-s3';

export default function(configId) {
  var settings;
  let localState = InstalledComponentStore.getLocalState(COMPONENT_ID, configId);
  const defaultSettings = Immutable.fromJS(parseConfiguration(Immutable.Map(), configId));
  const configData =  InstalledComponentStore.getConfigData(COMPONENT_ID, configId) || defaultSettings;
  if (!configData.isEmpty()) {
    settings = localState.get('settings', Immutable.fromJS(parseConfiguration(configData, configId)));
  } else {
    settings = localState.get('settings', defaultSettings);
  }

  return {
    settings: settings,
    getLocalState(path) {
      if (_.isEmpty(path)) {
        return localState || Immutable.Map();
      }
      return localState.getIn([].concat(path), Immutable.Map());
    }
  };
}

import {Map} from 'immutable';
import _ from 'underscore';

import InstalledComponentStore from '../components/stores/InstalledComponentsStore';

// utils
import {createConfiguration} from './utils';

const COMPONENT_ID = 'keboola.csv-import';

// validovat soubor
function isUploaderValid(localState) {
  if (localState.has('file') && localState.get('file') && localState.get('file').size && localState.get('file').name) {
    return true;
  }
  return false;
}

function isUploaderFileTooBig(localState) {
  if (!localState.get('file')) {
    return false;
  }
  if (isUploaderValid(localState) && localState.get('file').size > 100 * 1024 * 1024) {
    return true;
  }
  return false;
}

function isUploaderFileInvalidFormat(localState) {
  if (!localState.get('file')) {
    return false;
  }
  if (!isUploaderValid(localState)) {
    return false;
  }
  const fileName = localState.get('file').name || '';
  if (fileName === '') {
    return false;
  }
  const suffix = fileName.substring(fileName.lastIndexOf('.'));
  return (['.csv', '.gz', '.tsv'].indexOf(suffix) === -1);
}

export default function(configId) {
  var settings;
  const defaultSettings = createConfiguration(Map(), configId);
  const configData =  InstalledComponentStore.getConfigData(COMPONENT_ID, configId) || defaultSettings;
  const localState = InstalledComponentStore.getLocalState(COMPONENT_ID, configId);
  if (!configData.isEmpty()) {
    settings = localState.get('settings', configData);
  } else {
    settings = localState.get('settings', defaultSettings);
  }
  return {
    isUploaderValid: isUploaderValid(localState) && !isUploaderFileInvalidFormat(localState),
    isUploaderFileTooBig: isUploaderFileTooBig(localState),
    isUploaderFileInvalidFormat: isUploaderFileInvalidFormat(localState),
    settings: settings,
    // local state stuff
    getLocalState(path) {
      if (_.isEmpty(path)) {
        return localState || Map();
      }
      return localState.getIn([].concat(path), Map());
    }
  };
}

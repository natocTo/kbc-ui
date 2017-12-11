import Immutable from 'immutable';
import _ from 'underscore';

import InstalledComponentStore from '../../../components/stores/InstalledComponentsStore';
import {parseConfiguration} from '../adapters/credentials';

const COMPONENT_ID = 'keboola.ex-aws-s3';

export default function(configId) {
  let credentials;
  let localState = InstalledComponentStore.getLocalState(COMPONENT_ID, configId);
  const defaultCredentials = parseConfiguration(Immutable.fromJS({}));
  const configData =  InstalledComponentStore.getConfigData(COMPONENT_ID, configId) || defaultCredentials;
  if (!configData.isEmpty()) {
    credentials = localState.get('credentials', parseConfiguration(Immutable.fromJS(configData)));
  } else {
    credentials = localState.get('credentials', defaultCredentials);
  }

  return {
    credentials: credentials,
    getLocalState(path) {
      if (_.isEmpty(path)) {
        return localState || Immutable.Map();
      }
      return localState.getIn([].concat(path), Immutable.Map());
    }
  };
}

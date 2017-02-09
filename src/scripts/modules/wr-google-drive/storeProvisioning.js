import {Map, List} from 'immutable';
import InstalledComponentStore from '../components/stores/InstalledComponentsStore';
import _ from 'underscore';
import OauthStore from '../oauth-v2/Store';

export const storeMixins = [InstalledComponentStore, OauthStore];

export default function(COMPONENT_ID, configId) {
  const localState = () => InstalledComponentStore.getLocalState(COMPONENT_ID, configId) || Map();
  const configData =  InstalledComponentStore.getConfigData(COMPONENT_ID, configId) || Map();
  const oauthCredentialsId = configData.getIn(['authorization', 'oauth_api', 'id'], configId);
  const parameters = configData.get('parameters', Map());
  const items = parameters.get('files', List());

  const tempPath = ['_'];
  const savingSheetPath = tempPath.concat('savingSheet');
  const editPath = tempPath.concat('editing');
  const editData = localState().getIn(editPath, Map());
  const pendingPath = tempPath.concat('pending');

  return {
    configData: configData,
    parameters: parameters,
    oauthCredentials: OauthStore.getCredentials(COMPONENT_ID, oauthCredentialsId) || Map(),
    oauthCredentialsId: oauthCredentialsId,
    items: items,
    hasItems: items.count() > 0,

    // local state stuff
    getLocalState(path) {
      if (_.isEmpty(path)) {
        return localState() || Map();
      }
      return localState().getIn([].concat(path), Map());
    },
    getEditPath: (what) => what ? editPath.concat(what) : editPath,
    getPendingPath(what) {
      return pendingPath.concat(what);
    },
    isEditing: (what) => editData.hasIn([].concat(what)),
    isSavingSheet: (id) => localState().getIn(savingSheetPath.concat(id), false),
    isPending(what) {
      return localState().getIn(pendingPath.concat(what), null);
    },
    isAuthorized() {
      const creds = this.oauthCredentials;
      return creds && creds.has('id');
    }
  };
}

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
  const tables = parameters.get('tables', List());
  const mappings = configData.getIn(['storage', 'input', 'tables'], Map());

  const tempPath = ['_'];
  const editPath = tempPath.concat('editing');
  const editData = localState().getIn(editPath, Map());
  const pendingPath = tempPath.concat('pending');
  const savingPath = tempPath.concat('saving');

  function findTable(tid) {
    return tables.findLast((t) => t.get('id') === tid);
  }

  return {
    configData: configData,
    parameters: parameters,
    oauthCredentials: OauthStore.getCredentials(COMPONENT_ID, oauthCredentialsId) || Map(),
    oauthCredentialsId: oauthCredentialsId,
    tables: tables,
    hasTables: tables.count() > 0,
    mappings: mappings,

    // local state stuff
    getLocalState(path) {
      if (_.isEmpty(path)) {
        return localState() || Map();
      }
      return localState().getIn([].concat(path), Map());
    },

    getRunSingleData(tid) {
      const table = findTable(tid).set('enabled', true);
      return configData.setIn(['parameters', 'tables'], List().push(table)).toJS();
    },
    getInputMapping(tableId) {
      return mappings.find((t) => t.get('source') === tableId);
    },
    getEditPath: (what) => what ? editPath.concat(what) : editPath,
    getPendingPath: (what) => pendingPath.concat(what),
    getSavingPath: (what) => savingPath.concat(what),
    isEditing: (what) => editData.hasIn([].concat(what)),
    isSaving: (what) => localState().getIn(savingPath.concat(what), false),
    isPending: (what) => localState().getIn(pendingPath.concat(what), false),
    isAuthorized() {
      const creds = this.oauthCredentials;
      return creds && creds.has('id');
    }
  };
}

import { fromJS, Map } from 'immutable';
import StoreUtils from '../../../utils/StoreUtils';
import Constants from '../Constants';
import Dispatcher from '../../../Dispatcher';

let _store = Map({
  credentials: Map(),
  pendingActions: Map(),
  touch: null,
  isLoading: false,
  isLoaded: false,
  isExtending: false
});

const MySqlSandboxCredentialsStore = StoreUtils.createStore({
  getCredentials() {
    return _store.get('credentials');
  },

  getValidUntil() {
    return (_store.get('touch') + 3600 * 24 * 14) * 1000;
  },

  hasCredentials() {
    return !!_store.getIn(['credentials', 'id']);
  },

  getPendingActions() {
    return _store.get('pendingActions');
  },

  getIsLoading() {
    return _store.get('isLoading');
  },

  getIsLoaded() {
    return _store.get('isLoaded');
  }
});

Dispatcher.register(function(payload) {
  const { action } = payload;
  switch (action.type) {
    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_LOAD:
      _store = _store.set('isLoading', true);
      _store = _store.set('isLoaded', false);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_LOAD_SUCCESS:
      _store = _store.set('credentials', fromJS(action.credentials));
      _store = _store.set('touch', action.touch);
      _store = _store.set('isLoaded', true);
      _store = _store.set('isLoading', false);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_LOAD_ERROR:
      _store = _store.set('isLoading', false);
      _store = _store.set('isLoaded', true);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_CREATE:
      _store = _store.setIn(['pendingActions', 'create'], true);
      _store = _store.set('isLoading', true);
      _store = _store.set('isLoaded', false);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_CREATE_SUCCESS:
      _store = _store.set('credentials', fromJS(action.credentials));
      _store = _store.set('touch', action.touch);
      _store = _store.deleteIn(['pendingActions', 'create']);
      _store = _store.set('isLoading', false);
      _store = _store.set('isLoaded', true);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_CREATE_ERROR:
      _store = _store.deleteIn(['pendingActions', 'create']);
      _store = _store.set('isLoading', false);
      _store = _store.set('isLoaded', false);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_DROP:
      _store = _store.setIn(['pendingActions', 'drop'], true);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_DROP_SUCCESS:
      _store = _store.set('credentials', Map());
      _store = _store.set('touch', null);
      _store = _store.deleteIn(['pendingActions', 'drop']);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_DROP_ERROR:
      _store = _store.deleteIn(['pendingActions', 'drop']);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_EXTEND:
      _store = _store.setIn(['pendingActions', 'extend'], true);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_EXTEND_SUCCESS:
      _store = _store.set('touch', action.touch);
      _store = _store.deleteIn(['pendingActions', 'extend']);
      return MySqlSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_EXTEND_ERROR:
      _store = _store.deleteIn(['pendingActions', 'extend']);
      return MySqlSandboxCredentialsStore.emitChange();

    default:
  }
});

export default MySqlSandboxCredentialsStore;

import Immutable from 'immutable';
import StoreUtils from '../../../utils/StoreUtils';
import Constants from '../Constants';
import Dispatcher from '../../../Dispatcher';

var _store = Immutable.Map({
  credentials: Immutable.Map(),
  pendingActions: Immutable.Map(),
  isLoading: false,
  isLoaded: false
});

var SnowflakeSandboxCredentialsStore = StoreUtils.createStore({
  getCredentials: function() {
    return _store.get('credentials');
  },
  hasCredentials: function() {
    return !!_store.getIn(['credentials', 'id']);
  },
  getPendingActions: function() {
    return _store.get('pendingActions');
  },
  getIsLoading: function() {
    return _store.get('isLoading');
  },
  getIsLoaded: function() {
    return _store.get('isLoaded');
  }
});

Dispatcher.register(function(payload) {
  var action, credentials;
  action = payload.action;
  switch (action.type) {

    case Constants.ActionTypes.CREDENTIALS_SNOWFLAKE_SANDBOX_LOAD:
      _store = _store.set('isLoading', true);
      return SnowflakeSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_SNOWFLAKE_SANDBOX_LOAD_SUCCESS:
      credentials = Immutable.fromJS(action.credentials);
      _store = _store.set('credentials', credentials);
      _store = _store.set('isLoaded', true);
      _store = _store.set('isLoading', false);
      return SnowflakeSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_SNOWFLAKE_SANDBOX_LOAD_ERROR:
      _store = _store.set('isLoading', false);
      return SnowflakeSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_SNOWFLAKE_SANDBOX_CREATE:
      _store = _store.setIn(['pendingActions', 'create'], true);
      return SnowflakeSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_SNOWFLAKE_SANDBOX_CREATE_SUCCESS:
      credentials = Immutable.fromJS(action.credentials);
      _store = _store.set('credentials', credentials);
      _store = _store.deleteIn(['pendingActions', 'create']);
      return SnowflakeSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_SNOWFLAKE_SANDBOX_CREATE_ERROR:
      _store = _store.deleteIn(['pendingActions', 'create']);
      return SnowflakeSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_SNOWFLAKE_SANDBOX_DROP:
      _store = _store.setIn(['pendingActions', 'drop'], true);
      return SnowflakeSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_SNOWFLAKE_SANDBOX_DROP_SUCCESS:
      _store = _store.set('credentials', Immutable.Map());
      _store = _store.deleteIn(['pendingActions', 'drop']);
      return SnowflakeSandboxCredentialsStore.emitChange();

    case Constants.ActionTypes.CREDENTIALS_SNOWFLAKE_SANDBOX_DROP_ERROR:
      _store = _store.deleteIn(['pendingActions', 'drop']);
      return SnowflakeSandboxCredentialsStore.emitChange();

    default:
      break;
  }
});

module.exports = SnowflakeSandboxCredentialsStore;

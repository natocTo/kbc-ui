import Dispatcher from '../../../Dispatcher';
import constants from '../ConfigRowsConstants';
import Immutable from 'immutable';
import {Map} from 'immutable';
import StoreUtils from '../../../utils/StoreUtils';
import fromJSOrdered from '../../../utils/fromJSOrdered';
import InstalledComponentsConstants from '../Constants';

var _store = Map({
  rows: Map(),
  pendingActions: Map(),
  editingJSONDataString: Map()
});

let ConfigRowsStore = StoreUtils.createStore({
  get: function(componentId, configId, rowId) {
    return _store.getIn(['rows', componentId, configId, rowId], Map());
  },

  getConfiguration: function(componentId, configId, rowId) {
    return _store.getIn(['rows', componentId, configId, rowId, 'configuration'], Map());
  },

  getRows: function(componentId, configId) {
    return _store.getIn(['rows', componentId, configId], Map());
  },

  isEditingJSONDataStringValid: function(componentId, configId, rowId) {
    var value;
    value = this.getEditingJSONDataString(componentId, configId, rowId);
    try {
      JSON.parse(value);
      return true;
    } catch (exception) {
      return false;
    }
  },

  getEditingJSONDataString: function(componentId, configId, rowId) {
    return _store.getIn(
      ['editingJSONDataString', componentId, configId, rowId],
      JSON.stringify(this.getConfiguration(componentId, configId, rowId), null, '  ')
    );
  },

  isEditingJSONDataString: function(componentId, configId, rowId) {
    return _store.hasIn(['editingJSONDataString', componentId, configId, rowId]);
  },

  getPendingActions: function(componentId, configId, rowId) {
    return _store.getIn(['pendingActions', componentId, configId, rowId], Map());
  }

});

Dispatcher.register(function(payload) {
  const action = payload.action;
  switch (action.type) {
    case InstalledComponentsConstants.ActionTypes.INSTALLED_COMPONENTS_CONFIGDATA_LOAD_SUCCESS:
      _store = _store.withMutations(function(store) {
        let retVal = store;
        retVal = retVal.deleteIn(['rows', action.componentId, action.configId]);
        action.data.rows.forEach(function(row) {
          retVal = retVal.setIn(['rows', action.componentId, action.configId, row.id], Immutable.fromJS(row));
        });
        return retVal;
      });
      return ConfigRowsStore.emitChange();

    case InstalledComponentsConstants.ActionTypes.INSTALLED_COMPONENTS_CONFIGSDATA_LOAD_SUCCESS:
      _store = _store.withMutations(function(store) {
        let retVal = store;
        action.configData.forEach(function(config) {
          retVal = retVal.deleteIn(['rows', action.componentId]);
          config.rows.forEach(function(row) {
            retVal = retVal.setIn(['rows', action.componentId, config.id, row.id], Immutable.fromJS(row));
          });
        });
        return retVal;
      });
      return ConfigRowsStore.emitChange();


    case constants.ActionTypes.CONFIG_ROWS_CREATE_START:
      _store = _store.setIn(['creatingConfigurationRows', action.componentId, action.configurationId], true);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_CREATE_ERROR:
      _store = _store.deleteIn(['creatingConfigurationRows', action.componentId, action.configurationId]);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_CREATE_SUCCESS:
      _store = _store
        .setIn(
          ['rows', action.componentId, action.configurationId, action.data.id],
          fromJSOrdered(action.data)
        );
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_DELETE_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'delete'], true);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_DELETE_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'delete']);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_DELETE_SUCCESS:
      _store = _store
        .deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'delete'])
        .deleteIn(['rows', action.componentId, action.configurationId, action.rowId]);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_ENABLE_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'enable'], true);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_ENABLE_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'enable']);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_ENABLE_SUCCESS:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'enable'])
        .setIn(['rows', action.componentId, action.configurationId, action.rowId, 'isDisabled'], false);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_DISABLE_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'disable'], true);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_DISABLE_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'disable']);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_DISABLE_SUCCESS:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'disable'])
        .setIn(['rows', action.componentId, action.configurationId, action.rowId, 'isDisabled'], true);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_UPDATE_JSON_DATA_STRING:
      _store = _store.setIn(
        ['editingJSONDataString', action.componentId, action.configurationId, action.rowId],
        action.jsonDataString
      );
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_RESET_JSON_DATA_STRING:
      _store = _store.deleteIn(
        ['editingJSONDataString', action.componentId, action.configurationId, action.rowId]
      );
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_SAVE_JSON_DATA_STRING_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-json-data'], true);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_SAVE_JSON_DATA_STRING_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-json-data']);
      return ConfigRowsStore.emitChange();

    case constants.ActionTypes.CONFIG_ROWS_SAVE_JSON_DATA_STRING_SUCCESS:
      _store = _store
        .deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-json-data'])
        .deleteIn(['editingJSONDataString', action.componentId, action.configurationId, action.rowId])
        .setIn(['rows', action.componentId, action.configurationId, action.rowId, 'configuration'], action.jsonData);
      return ConfigRowsStore.emitChange();

    default:
      break;
  }
});

module.exports = ConfigRowsStore;


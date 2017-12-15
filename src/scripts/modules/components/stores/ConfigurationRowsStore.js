import Dispatcher from '../../../Dispatcher';
import constants from '../ConfigurationRowsConstants';
import Immutable from 'immutable';
import {Map} from 'immutable';
import StoreUtils from '../../../utils/StoreUtils';
import fromJSOrdered from '../../../utils/fromJSOrdered';
import InstalledComponentsConstants from '../Constants';

var _store = Map({
  rows: Map(),
  pendingActions: Map(),
  editing: Map(),
  creating: Map(),
  jsonEditor: Map()
});

let ConfigurationRowsStore = StoreUtils.createStore({
  get: function(componentId, configId, rowId) {
    return _store.getIn(['rows', componentId, configId, rowId], Map());
  },

  getConfiguration: function(componentId, configId, rowId) {
    return _store.getIn(['rows', componentId, configId, rowId, 'configuration'], Map());
  },

  getRows: function(componentId, configId) {
    return _store.getIn(['rows', componentId, configId], Map());
  },

  isEditingParametersValid: function(componentId, configId, rowId) {
    var value;
    value = this.getEditingParametersString(componentId, configId, rowId);
    try {
      JSON.parse(value);
      return true;
    } catch (exception) {
      return false;
    }
  },

  getEditingParametersString: function(componentId, configId, rowId) {
    return _store.getIn(
      ['editing', componentId, configId, rowId, 'parameters'],
      JSON.stringify(this.getConfiguration(componentId, configId, rowId).get('parameters', Immutable.Map()), null, '  ')
    );
  },

  isEditingParameters: function(componentId, configId, rowId) {
    return _store.hasIn(['editing', componentId, configId, rowId, 'parameters']);
  },

  isEditingProcessorsValid: function(componentId, configId, rowId) {
    var value;
    value = this.getEditingProcessorsString(componentId, configId, rowId);
    try {
      JSON.parse(value);
      return true;
    } catch (exception) {
      return false;
    }
  },

  getEditingProcessorsString: function(componentId, configId, rowId) {
    return _store.getIn(
      ['editing', componentId, configId, rowId, 'processors'],
      JSON.stringify(this.getConfiguration(componentId, configId, rowId).get('processors', Immutable.Map()).toJS(), null, '  ')
    );
  },

  isEditingProcessors: function(componentId, configId, rowId) {
    return _store.hasIn(['editing', componentId, configId, rowId, 'processors']);
  },

  getPendingActions: function(componentId, configId, rowId) {
    return _store.getIn(['pendingActions', componentId, configId, rowId], Map());
  },

  getEditingConfiguration: function(componentId, configId, rowId, parseFn) {
    const storedConfiguration = parseFn(this.getConfiguration(componentId, configId, rowId));
    return _store.getIn(
      ['editing', componentId, configId, rowId, 'configuration'],
      storedConfiguration
    );
  },

  isEditingConfiguration: function(componentId, configId, rowId) {
    return _store.hasIn(['editing', componentId, configId, rowId, 'configuration']);
  },

  hasJsonEditor: function(componentId, configId, rowId) {
    return _store.hasIn(['jsonEditor', componentId, configId, rowId]);
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
      return ConfigurationRowsStore.emitChange();

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
      return ConfigurationRowsStore.emitChange();


    case constants.ActionTypes.CONFIGURATION_ROWS_CREATE_START:
      _store = _store.setIn(['creating', action.componentId, action.configurationId], true);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_CREATE_ERROR:
      _store = _store.deleteIn(['creating', action.componentId, action.configurationId]);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_CREATE_SUCCESS:
      _store = _store
        .setIn(
          ['rows', action.componentId, action.configurationId, action.data.id],
          fromJSOrdered(action.data)
        );
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_DELETE_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'delete'], true);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_DELETE_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'delete']);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_DELETE_SUCCESS:
      _store = _store
        .deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'delete'])
        .deleteIn(['rows', action.componentId, action.configurationId, action.rowId]);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_ENABLE_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'enable'], true);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_ENABLE_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'enable']);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_ENABLE_SUCCESS:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'enable'])
        .setIn(['rows', action.componentId, action.configurationId, action.rowId, 'isDisabled'], false);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_DISABLE_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'disable'], true);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_DISABLE_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'disable']);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_DISABLE_SUCCESS:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'disable'])
        .setIn(['rows', action.componentId, action.configurationId, action.rowId, 'isDisabled'], true);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_UPDATE_PARAMETERS:
      _store = _store.setIn(
        ['editing', action.componentId, action.configurationId, action.rowId, 'parameters'],
        action.value
      );
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_RESET_PARAMETERS:
      _store = _store.deleteIn(
        ['editing', action.componentId, action.configurationId, action.rowId, 'parameters']
      );
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PARAMETERS_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-parameters'], true);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PARAMETERS_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-parameters']);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PARAMETERS_SUCCESS:
      _store = _store
        .deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-parameters'])
        .deleteIn(['editing', action.componentId, action.configurationId, action.rowId, 'parameters'])
        .setIn(['rows', action.componentId, action.configurationId, action.rowId, 'configuration'], action.value);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_UPDATE_PROCESSORS:
      _store = _store.setIn(
        ['editing', action.componentId, action.configurationId, action.rowId, 'processors'],
        action.value
      );
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_RESET_PROCESSORS:
      _store = _store.deleteIn(
        ['editing', action.componentId, action.configurationId, action.rowId, 'processors']
      );
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PROCESSORS_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-processors'], true);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PROCESSORS_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-processors']);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PROCESSORS_SUCCESS:
      _store = _store
        .deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-processors'])
        .deleteIn(['editing', action.componentId, action.configurationId, action.rowId, 'processors'])
        .setIn(['rows', action.componentId, action.configurationId, action.rowId, 'configuration'], action.value);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_UPDATE_CONFIGURATION:
      _store = _store.setIn(
        ['editing', action.componentId, action.configurationId, action.rowId, 'configuration'],
        action.value
      );
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_RESET_CONFIGURATION:
      _store = _store.deleteIn(
        ['editing', action.componentId, action.configurationId, action.rowId, 'configuration']
      );
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_SAVE_CONFIGURATION_START:
      _store = _store.setIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-configuration'], true);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_SAVE_CONFIGURATION_ERROR:
      _store = _store.deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-configuration']);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_SAVE_CONFIGURATION_SUCCESS:
      _store = _store
        .deleteIn(['pendingActions', action.componentId, action.configurationId, action.rowId, 'save-configuration'])
        .deleteIn(['editing', action.componentId, action.configurationId, action.rowId])
        .setIn(['rows', action.componentId, action.configurationId, action.rowId], Immutable.fromJS(action.row));
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_JSON_EDITOR_OPEN:
      _store = _store
        .setIn(['jsonEditor', action.componentId, action.configurationId, action.rowId], true);
      return ConfigurationRowsStore.emitChange();

    case constants.ActionTypes.CONFIGURATION_ROWS_JSON_EDITOR_CLOSE:
      _store = _store
        .deleteIn(['jsonEditor', action.componentId, action.configurationId, action.rowId]);
      return ConfigurationRowsStore.emitChange();


    default:
      break;
  }
});

module.exports = ConfigurationRowsStore;


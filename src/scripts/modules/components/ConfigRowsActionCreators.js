import ApplicationActionCreators from '../../actions/ApplicationActionCreators';
import dispatcher from '../../Dispatcher';
import constants from './ConfigRowsConstants';
import ConfigRowsStore from './stores/ConfigRowsStore';
import installedComponentsApi from './InstalledComponentsApi';
import VersionActionCreators from '../components/VersionsActionCreators';
import configurationRowDeleted from './react/components/notifications/configurationRowDeleted';

module.exports = {
  create: function(componentId, configurationId, name, description, config) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_CREATE_START,
      componentId: componentId,
      configurationId: configurationId
    });
    const data = {
      name: name,
      description: description,
      configuration: config
    };
    const changeDescription = 'Row ' + name + ' added';
    return installedComponentsApi.createConfigurationRow(componentId, configurationId, data, changeDescription)
      .then(function(response) {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        return dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_CREATE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          data: response
        });
      }).catch(function(e) {
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_CREATE_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          error: e
        });
        throw e;
      });
  },

  delete: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_DELETE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' deleted';
    return installedComponentsApi.deleteConfigurationRow(componentId, configurationId, rowId, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_DELETE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId
        });
        return ApplicationActionCreators.sendNotification({
          message: configurationRowDeleted(row)
        });
      }).catch(function(e) {
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_DELETE_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  disable: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_DISABLE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' disabled';
    return installedComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {isDisabled: 1}, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_DISABLE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId
        });
      }).catch(function(e) {
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_DISABLE_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  enable: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_ENABLE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' enabled';
    return installedComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {isDisabled: 0}, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_ENABLE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId
        });
      }).catch(function(e) {
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_ENABLE_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  updateJSONDataString: function(componentId, configurationId, rowId, jsonDataString) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_UPDATE_JSON_DATA_STRING,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId,
      jsonDataString: jsonDataString
    });
  },

  resetJSONDataString: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_RESET_JSON_DATA_STRING,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  saveJSONDataString: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_SAVE_JSON_DATA_STRING_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' edited';
    const configuration = ConfigRowsStore.getEditingJSONDataString(componentId, configurationId, rowId);
    return installedComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {configuration: configuration}, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_SAVE_JSON_DATA_STRING_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          jsonData: JSON.parse(configuration)
        });
      }).catch(function(e) {
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_SAVE_JSON_DATA_STRING_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  }
};

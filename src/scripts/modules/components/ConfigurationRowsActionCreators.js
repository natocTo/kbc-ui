import ApplicationActionCreators from '../../actions/ApplicationActionCreators';
import dispatcher from '../../Dispatcher';
import constants from './ConfigurationRowsConstants';
import ConfigurationRowsStore from './stores/ConfigurationRowsStore';
import installedComponentsApi from './InstalledComponentsApi';
import VersionActionCreators from '../components/VersionsActionCreators';
import configurationRowDeleted from './react/components/notifications/configurationRowDeleted';
import Immutable from 'immutable';

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
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
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
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
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
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
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

  updateParameters: function(componentId, configurationId, rowId, value) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_UPDATE_PARAMETERS,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId,
      value: value
    });
  },

  resetParameters: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_RESET_PARAMETERS,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  saveParameters: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_SAVE_PARAMETERS_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' parameters edited';
    let configuration = ConfigurationRowsStore.getConfiguration(componentId, configurationId, rowId);
    let parameters = ConfigurationRowsStore.getEditingParametersString(componentId, configurationId, rowId);
    configuration = configuration.set('parameters', Immutable.fromJS(JSON.parse(parameters)));

    return installedComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {configuration: JSON.stringify(configuration.toJS())}, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_SAVE_PARAMETERS_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          value: configuration
        });
      }).catch(function(e) {
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_SAVE_PARAMETERS_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  updateProcessors: function(componentId, configurationId, rowId, value) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_UPDATE_PROCESSORS,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId,
      value: value
    });
  },

  resetProcessors: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_RESET_PROCESSORS,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  saveProcessors: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_SAVE_PROCESSORS_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' processors edited';
    let configuration = ConfigurationRowsStore.getConfiguration(componentId, configurationId, rowId);
    let processors = ConfigurationRowsStore.getEditingProcessorsString(componentId, configurationId, rowId);
    configuration = configuration.set('processors', Immutable.fromJS(JSON.parse(processors)));
    return installedComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {configuration: JSON.stringify(configuration.toJS())}, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_SAVE_PROCESSORS_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          value: configuration
        });
      }).catch(function(e) {
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_SAVE_PROCESSORS_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  updateConfiguration: function(componentId, configurationId, rowId, value) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_UPDATE_CONFIGURATION,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId,
      value: value
    });
  },

  resetConfiguration: function(componentId, configurationId, rowId) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_RESET_CONFIGURATION,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  saveConfiguration: function(componentId, configurationId, rowId, createFn, parseFn) {
    dispatcher.handleViewAction({
      type: constants.ActionTypes.CONFIG_ROWS_SAVE_CONFIGURATION_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' edited';
    const configuration = createFn(ConfigurationRowsStore.getEditingConfiguration(componentId, configurationId, rowId, parseFn));
    return installedComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {configuration: JSON.stringify(configuration.toJS())}, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_SAVE_CONFIGURATION_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          value: configuration
        });
      }).catch(function(e) {
        dispatcher.handleViewAction({
          type: constants.ActionTypes.CONFIG_ROWS_SAVE_CONFIGURATION_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  }
};

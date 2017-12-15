import ApplicationActionCreators from '../../actions/ApplicationActionCreators';
import Dispatcher from '../../Dispatcher';
import Constants from './ConfigurationRowsConstants';
import ConfigurationRowsStore from './stores/ConfigurationRowsStore';
import InstalledComponentsApi from './InstalledComponentsApi';
import InstalledComponentsStore from './stores/InstalledComponentsStore';
import VersionActionCreators from '../components/VersionsActionCreators';
import ApplicationStore from '../../stores/ApplicationStore';
import RoutesStore from '../../stores/RoutesStore';
import configurationRowDeleted from './react/components/notifications/configurationRowDeleted';
import Immutable from 'immutable';
import removeEmptyEncryptAttributes from './utils/removeEmptyEncryptAttributes';
import preferEncryptedAttributes from './utils/preferEncryptedAttributes';

const storeEncodedConfigurationRow = function(componentId, configurationId, rowId, configuration, changeDescription) {
  let component = InstalledComponentsStore.getComponent(componentId);
  if (component.get('flags').includes('encrypt')) {
    const dataToSavePrepared = JSON.stringify(removeEmptyEncryptAttributes(preferEncryptedAttributes(configuration)));
    const projectId = ApplicationStore.getCurrentProject().get('id');
    return InstalledComponentsApi.encryptConfiguration(componentId, projectId, dataToSavePrepared).then(function(encryptedResponse) {
      const dataToSaveEncrypted = {
        configuration: JSON.stringify(encryptedResponse.body),
        changeDescription: changeDescription
      };
      return InstalledComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, dataToSaveEncrypted, changeDescription);
    });
  } else {
    const dataToSavePrepared = {
      configuration: JSON.stringify(configuration),
      changeDescription: changeDescription
    };
    return InstalledComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, dataToSavePrepared, changeDescription);
  }
};

module.exports = {
  create: function(componentId, configurationId, name, description, config) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_CREATE_START,
      componentId: componentId,
      configurationId: configurationId
    });
    const data = {
      name: name,
      description: description,
      configuration: config
    };
    const changeDescription = 'Row ' + name + ' added';
    return InstalledComponentsApi.createConfigurationRow(componentId, configurationId, data, changeDescription)
      .then(function(response) {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        return Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_CREATE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          data: response
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_CREATE_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          error: e
        });
        throw e;
      });
  },

  delete: function(componentId, configurationId, rowId, transition) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_DELETE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' deleted';
    if (transition) {
      const transitionParams = {
        component: componentId,
        config: configurationId
      };
      RoutesStore.getRouter().transitionTo(componentId, transitionParams);
    }

    return InstalledComponentsApi.deleteConfigurationRow(componentId, configurationId, rowId, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_DELETE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId
        });
        return ApplicationActionCreators.sendNotification({
          message: configurationRowDeleted(row)
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_DELETE_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  disable: function(componentId, configurationId, rowId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_DISABLE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' disabled';
    return InstalledComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {isDisabled: 1}, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_DISABLE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_DISABLE_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  enable: function(componentId, configurationId, rowId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_ENABLE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' enabled';
    return InstalledComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {isDisabled: 0}, changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_ENABLE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_ENABLE_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  updateParameters: function(componentId, configurationId, rowId, value) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_UPDATE_PARAMETERS,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId,
      value: value
    });
  },

  resetParameters: function(componentId, configurationId, rowId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_RESET_PARAMETERS,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  saveParameters: function(componentId, configurationId, rowId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PARAMETERS_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' parameters edited';
    let configuration = ConfigurationRowsStore.getConfiguration(componentId, configurationId, rowId);
    let parameters = ConfigurationRowsStore.getEditingParametersString(componentId, configurationId, rowId);
    configuration = configuration.set('parameters', Immutable.fromJS(JSON.parse(parameters)));

    return storeEncodedConfigurationRow(componentId, configurationId, rowId, configuration.toJS(), changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PARAMETERS_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          value: configuration
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PARAMETERS_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  updateProcessors: function(componentId, configurationId, rowId, value) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_UPDATE_PROCESSORS,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId,
      value: value
    });
  },

  resetProcessors: function(componentId, configurationId, rowId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_RESET_PROCESSORS,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  saveProcessors: function(componentId, configurationId, rowId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PROCESSORS_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' processors edited';
    let configuration = ConfigurationRowsStore.getConfiguration(componentId, configurationId, rowId);
    let processors = ConfigurationRowsStore.getEditingProcessorsString(componentId, configurationId, rowId);
    configuration = configuration.set('processors', Immutable.fromJS(JSON.parse(processors)));
    return storeEncodedConfigurationRow(componentId, configurationId, rowId, configuration.toJS(), changeDescription)
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PROCESSORS_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          value: configuration
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_PROCESSORS_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  updateConfiguration: function(componentId, configurationId, rowId, value) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_UPDATE_CONFIGURATION,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId,
      value: value
    });
  },

  resetConfiguration: function(componentId, configurationId, rowId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_RESET_CONFIGURATION,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  saveConfiguration: function(componentId, configurationId, rowId, createFn, parseFn) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_CONFIGURATION_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const changeDescription = 'Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' edited';
    const configuration = createFn(ConfigurationRowsStore.getEditingConfiguration(componentId, configurationId, rowId, parseFn));
    return storeEncodedConfigurationRow(componentId, configurationId, rowId, configuration.toJS(), changeDescription)
      .then(function(response) {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_CONFIGURATION_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          row: response
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_CONFIGURATION_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  },

  openJsonEditor: function(componentId, configurationId, rowId) {
    this.resetConfiguration(componentId, configurationId, rowId);
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_JSON_EDITOR_OPEN,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  closeJsonEditor: function(componentId, configurationId, rowId) {
    this.resetParameters(componentId, configurationId, rowId);
    this.resetProcessors(componentId, configurationId, rowId);
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_JSON_EDITOR_CLOSE,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  }

};

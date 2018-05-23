import ApplicationActionCreators from '../../actions/ApplicationActionCreators';
import Dispatcher from '../../Dispatcher';
import Constants from './ConfigurationRowsConstants';
import ConfigurationRowsStore from './ConfigurationRowsStore';
import InstalledComponentsApi from '../components/InstalledComponentsApi';
import VersionActionCreators from '../components/VersionsActionCreators';
import ApplicationStore from '../../stores/ApplicationStore';
import RoutesStore from '../../stores/RoutesStore';
import configurationRowDeleted from '../components/react/components/notifications/configurationRowDeleted';
import Immutable from 'immutable';
import removeEmptyEncryptAttributes from '../components/utils/removeEmptyEncryptAttributes';
import preferEncryptedAttributes from '../components/utils/preferEncryptedAttributes';
import stringUtils from '../../utils/string';
const { webalize } = stringUtils;
import {Map} from 'immutable';

const storeEncodedConfigurationRow = function(componentId, configurationId, rowId, configuration, changeDescription) {
  const dataToSavePrepared = JSON.stringify(removeEmptyEncryptAttributes(preferEncryptedAttributes(configuration)));
  const projectId = ApplicationStore.getCurrentProject().get('id');
  return InstalledComponentsApi.encryptConfiguration(componentId, projectId, dataToSavePrepared).then(function(encryptedResponse) {
    const dataToSaveEncrypted = {
      configuration: JSON.stringify(encryptedResponse.body),
      changeDescription: changeDescription
    };
    return InstalledComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, dataToSaveEncrypted, changeDescription);
  });
};

module.exports = {
  create: function(componentId, configurationId, name, description, emptyConfigFn, createCallback, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_CREATE_START,
      componentId: componentId,
      configurationId: configurationId
    });
    const data = {
      name: name,
      description: description,
      configuration: JSON.stringify(emptyConfigFn(name, webalize(name)).toJS())
    };
    return InstalledComponentsApi.createConfigurationRow(componentId, configurationId, data, changeDescription ? changeDescription : 'Row ' + name + ' added')
      .then(function(response) {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        createCallback(response.id);
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

  delete: function(componentId, configurationId, rowId, transition, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_DELETE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    if (transition) {
      const transitionParams = {
        component: componentId,
        config: configurationId
      };
      RoutesStore.getRouter().transitionTo(componentId, transitionParams);
    }

    return InstalledComponentsApi.deleteConfigurationRow(componentId, configurationId, rowId, changeDescription ? changeDescription : ('Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' deleted'))
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_DELETE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId
        });
        return ApplicationActionCreators.sendNotification({
          message: configurationRowDeleted(row, changeDescription + '.', componentId, configurationId)
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

  disable: function(componentId, configurationId, rowId, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_DISABLE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    return InstalledComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {isDisabled: 1}, changeDescription ? changeDescription : ('Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' disabled'))
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

  enable: function(componentId, configurationId, rowId, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_ENABLE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    return InstalledComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {isDisabled: 0}, changeDescription ? changeDescription : ('Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' enabled'))
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

  updateJsonConfiguration: function(componentId, configurationId, rowId, value) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_UPDATE_JSON_CONFIGURATION,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId,
      value: value
    });
  },

  resetJsonConfiguration: function(componentId, configurationId, rowId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_RESET_JSON_CONFIGURATION,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  saveJsonConfiguration: function(componentId, configurationId, rowId, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_JSON_CONFIGURATION_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId, changeDescription);
    const configuration = Immutable.fromJS(JSON.parse(ConfigurationRowsStore.getEditingJsonConfigurationString(componentId, configurationId, rowId)));

    return storeEncodedConfigurationRow(componentId, configurationId, rowId, configuration.toJS(), changeDescription ? changeDescription : ('Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' parameters edited manually'))
      .then(function() {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_JSON_CONFIGURATION_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          value: configuration
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_JSON_CONFIGURATION_ERROR,
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


  saveConfigurationBySections: function(componentId, configurationId, rowId, createFn, createFnSections, parseFn, parseFnSections, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_CONFIGURATION_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const configurationBySections = ConfigurationRowsStore.getEditingConfigurationBySections(componentId, configurationId, rowId, parseFn, parseFnSections);

    const configuration = configurationBySections
      .get('sections')
      .reduce((memo, sectionConfig, index) => {
        const createSectionFn = createFnSections.get(index);
        return memo.merge(createSectionFn(sectionConfig));
      }, Map());
    return storeEncodedConfigurationRow(componentId, configurationId, rowId, configuration.toJS(), changeDescription ? changeDescription : ('Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' edited'))
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

  saveConfiguration: function(componentId, configurationId, rowId, createFn, parseFn, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_SAVE_CONFIGURATION_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    const row = ConfigurationRowsStore.get(componentId, configurationId, rowId);
    const configuration = createFn(ConfigurationRowsStore.getEditingConfiguration(componentId, configurationId, rowId, parseFn));
    return storeEncodedConfigurationRow(componentId, configurationId, rowId, configuration.toJS(), changeDescription ? changeDescription : ('Row ' + (row.get('name') !== '' ? row.get('name') : 'Untitled') + ' edited'))
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
    this.resetJsonConfiguration(componentId, configurationId, rowId);
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_JSON_EDITOR_CLOSE,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
  },

  clearState: function(componentId, configurationId, rowId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATION_ROWS_CLEAR_STATE_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: rowId
    });
    return InstalledComponentsApi.updateConfigurationRow(componentId, configurationId, rowId, {state: '{}'})
      .then(function(response) {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_CLEAR_STATE_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          row: response
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATION_ROWS_CLEAR_STATE_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          rowId: rowId,
          error: e
        });
        throw e;
      });
  }
};

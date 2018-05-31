import Dispatcher from '../../Dispatcher';
import Constants from './ConfigurationsConstants';
import ConfigurationsStore from './ConfigurationsStore';
import InstalledComponentsApi from '../components/InstalledComponentsApi';
import VersionActionCreators from '../components/VersionsActionCreators';
import ApplicationStore from '../../stores/ApplicationStore';
import removeEmptyEncryptAttributes from '../components/utils/removeEmptyEncryptAttributes';
import preferEncryptedAttributes from '../components/utils/preferEncryptedAttributes';
import {Map} from 'immutable';

const storeEncodedConfiguration = function(componentId, configurationId, configuration, changeDescription) {
  const dataToSavePrepared = JSON.stringify(removeEmptyEncryptAttributes(preferEncryptedAttributes(configuration)));
  const projectId = ApplicationStore.getCurrentProject().get('id');
  return InstalledComponentsApi.encryptConfiguration(componentId, projectId, dataToSavePrepared).then(function(encryptedResponse) {
    const dataToSaveEncrypted = {
      configuration: JSON.stringify(encryptedResponse.body),
      changeDescription: changeDescription
    };
    return InstalledComponentsApi.updateComponentConfiguration(componentId, configurationId, dataToSaveEncrypted);
  });
};

module.exports = {
  updateConfiguration: function(componentId, configurationId, value) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATIONS_UPDATE_CONFIGURATION,
      componentId: componentId,
      configurationId: configurationId,
      value: value
    });
  },

  resetConfiguration: function(componentId, configurationId) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATIONS_RESET_CONFIGURATION,
      componentId: componentId,
      configurationId: configurationId
    });
  },


  saveConfigurationBySections: function(componentId, configurationId, createFn, createFnSections, parseFn, parseFnSections, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_START,
      componentId: componentId,
      configurationId: configurationId
    });
    const configurationBySections = ConfigurationsStore.getEditingConfigurationBySections(componentId, configurationId, parseFn, parseFnSections);

    const configuration = configurationBySections
      .reduce((memo, sectionConfig, index) => {
        const createSectionFn = createFnSections.get(index);
        return memo.merge(createSectionFn(sectionConfig));
      }, Map());

    return storeEncodedConfiguration(componentId, configurationId, configuration.toJS(), changeDescription ? changeDescription : 'Configuration edited')
      .then(function(response) {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          configuration: response
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          error: e
        });
        throw e;
      });
  },


  saveConfiguration: function(componentId, configurationId, createFn, parseFn, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_START,
      componentId: componentId,
      configurationId: configurationId
    });
    const configuration = createFn(ConfigurationsStore.getEditingConfiguration(componentId, configurationId, parseFn));

    return storeEncodedConfiguration(componentId, configurationId, configuration.toJS(), changeDescription ? changeDescription : 'Configuration edited')
      .then(function(response) {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          configuration: response
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          error: e
        });
        throw e;
      });
  },


  saveForcedConfiguration: function(componentId, configurationId, forcedConfiguration, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_START,
      componentId: componentId,
      configurationId: configurationId
    });
    return storeEncodedConfiguration(componentId, configurationId, forcedConfiguration.toJS(), changeDescription ? changeDescription : 'Configuration edited')
      .then(function(response) {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          configuration: response
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          error: e
        });
        throw e;
      });
  },

  orderRows: function(componentId, configurationId, rowIds, movedRowId, changeDescription) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATIONS_ORDER_ROWS_START,
      componentId: componentId,
      configurationId: configurationId,
      rowId: movedRowId,
      rowIds: rowIds
    });
    return InstalledComponentsApi.orderRows(componentId, configurationId, rowIds, changeDescription ? changeDescription : 'Rows order changed')
      .then(function(response) {
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATIONS_ORDER_ROWS_SUCCESS,
          componentId: componentId,
          configurationId: configurationId,
          response: response
        });
      }).catch(function(e) {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.CONFIGURATIONS_ORDER_ROWS_ERROR,
          componentId: componentId,
          configurationId: configurationId,
          error: e
        });
        throw e;
      });
  }
};

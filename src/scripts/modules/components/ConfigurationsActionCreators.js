import Dispatcher from '../../Dispatcher';
import Constants from './ConfigurationsConstants';
import ConfigurationsStore from './stores/ConfigurationsStore';
import InstalledComponentsApi from './InstalledComponentsApi';
import VersionActionCreators from '../components/VersionsActionCreators';
import InstalledComponentsStore from './stores/InstalledComponentsStore';
import ApplicationStore from '../../stores/ApplicationStore';
import removeEmptyEncryptAttributes from './utils/removeEmptyEncryptAttributes';
import preferEncryptedAttributes from './utils/preferEncryptedAttributes';

const storeEncodedConfiguration = function(componentId, configurationId, configuration, changeDescription) {
  let component = InstalledComponentsStore.getComponent(componentId);
  if (component.get('flags').includes('encrypt')) {
    const dataToSavePrepared = JSON.stringify(removeEmptyEncryptAttributes(preferEncryptedAttributes(configuration)));
    const projectId = ApplicationStore.getCurrentProject().get('id');
    return InstalledComponentsApi.encryptConfiguration(componentId, projectId, dataToSavePrepared).then(function(encryptedResponse) {
      const dataToSaveEncrypted = {
        configuration: JSON.stringify(encryptedResponse.body),
        changeDescription: changeDescription
      };
      return InstalledComponentsApi.updateComponentConfiguration(componentId, configurationId, dataToSaveEncrypted);
    });
  } else {
    const dataToSavePrepared = {
      configuration: JSON.stringify(configuration),
      changeDescription: changeDescription
    };
    return InstalledComponentsApi.updateComponentConfiguration(componentId, configurationId, dataToSavePrepared, changeDescription);
  }
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

  saveConfiguration: function(componentId, configurationId, createFn, parseFn) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATIONS_SAVE_CONFIGURATION_START,
      componentId: componentId,
      configurationId: configurationId
    });
    const changeDescription = 'Configuration edited';
    const configuration = createFn(ConfigurationsStore.getEditingConfiguration(componentId, configurationId, parseFn));

    return storeEncodedConfiguration(componentId, configurationId, configuration.toJS(), changeDescription)
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

  orderRows: function(componentId, configurationId, rowIds) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.CONFIGURATIONS_ORDER_ROWS_START,
      componentId: componentId,
      configurationId: configurationId,
      rowIds: rowIds
    });
    const changeDescription = 'Rows order changed';
    return InstalledComponentsApi.orderRows(componentId, configurationId, rowIds, changeDescription)
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

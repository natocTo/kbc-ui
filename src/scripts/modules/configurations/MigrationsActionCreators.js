import Dispatcher from '../../Dispatcher';
import Constants from './MigrationsConstants';
import ConfigurationsStore from './ConfigurationsStore';
import InstalledComponentsApi from '../components/InstalledComponentsApi';
import InstalledComponentsActionCreators from '../components/InstalledComponentsActionCreators';
import Promise from 'bluebird';
import successNotification from '../components/react/components/notifications/configurationMigratedSuccess';
import errorNotification from '../components/react/components/notifications/configurationMigratedError';
import ApplicationActionCreators from '../../actions/ApplicationActionCreators';
import VersionActionCreators from '../components/VersionsActionCreators';

module.exports = {
  migrateLegacyUI: function(componentId, configurationId, adapter) {
    Dispatcher.handleViewAction({
      type: Constants.ActionTypes.LEGACY_UI_MIGRATION_START,
      componentId: componentId,
      configurationId: configurationId
    });
    const changeDescription = 'Migrating configuration to latest version';
    const configuration = ConfigurationsStore.get(componentId, configurationId);
    const rows = adapter.get('getRowsCount')(configuration);
    let promises = [];
    for (let i = 0; i < rows; i++) {
      const configData = {
        name: adapter.get('getRowName')(configuration, i),
        configuration: JSON.stringify(adapter.get('getRowConfiguration')(configuration, i).toJS()),
        state: JSON.stringify(adapter.get('getRowState')(configuration, i).toJS())
      };
      promises.push(InstalledComponentsApi.createConfigurationRow(componentId, configurationId, configData, changeDescription));
    }
    const configData = {
      configuration: JSON.stringify(adapter.get('getRootConfiguration')(configuration).toJS()),
      state: JSON.stringify(adapter.get('getRootState')(configuration).toJS())
    };
    promises.push(InstalledComponentsApi.updateComponentConfiguration(componentId, configurationId, configData, changeDescription));
    return Promise
      .all(promises)
      .then(function() {
        InstalledComponentsActionCreators.loadComponentConfigDataForce(componentId, configurationId).then(function() {
          Dispatcher.handleViewAction({
            type: Constants.ActionTypes.LEGACY_UI_MIGRATION_SUCCESS,
            componentId: componentId,
            configurationId: configurationId
          });
        });
        VersionActionCreators.loadVersionsForce(componentId, configurationId);
        return ApplicationActionCreators.sendNotification({
          message: successNotification()
        });
      })
      .catch(function() {
        Dispatcher.handleViewAction({
          type: Constants.ActionTypes.LEGACY_UI_MIGRATION_ERROR,
          componentId: componentId,
          configurationId: configurationId
        });
        return ApplicationActionCreators.sendNotification({
          message: errorNotification(),
          type: 'error'
        });
      });
  }
};

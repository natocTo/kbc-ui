import Index from '../react/common/ConfigRows/Index';
import Row from '../react/common/ConfigRows/Row';
import Credentials from '../react/common/ConfigRows/Credentials';
import installedComponentsActions from '../modules/components/InstalledComponentsActionCreators';
import versionsActions from '../modules/components/VersionsActionCreators';
import jobsActions from '../modules/jobs/ActionCreators';
import InstalledComponentsStore from '../modules/components/stores/InstalledComponentsStore';
import ConfigurationRowsStore from '../modules/components/stores/ConfigurationRowsStore';

export default function(settings) {
  let route = {
    name: settings.componentId,
    settings: settings,
    path: ':config',
    title: (routerState) => {
      const configId = routerState.getIn(['params', 'config']);
      return InstalledComponentsStore.getConfig(settings.componentId, configId).get('name');
    },
    isComponent: true,
    defaultRouteHandler: Index,
    poll: {
      interval: 10,
      action: (params) => jobsActions.loadComponentConfigurationLatestJobs(settings.componentId, params.config)
    },
    requireData: [
      (params) => installedComponentsActions.loadComponentConfigData(settings.componentId, params.config),
      (params) => versionsActions.loadVersions(settings.componentId, params.config)
    ],
    childRoutes: []
  };
  if (settings.hasCredentials) {
    route.childRoutes.push(
      {
        name: settings.componentId + '-credentials',
        settings: settings,
        path: 'credentials',
        title: 'Credentials',
        defaultRouteHandler: Credentials
      }
    );
  }
  route.childRoutes.push(
    {
      name: settings.componentId + '-row',
      settings: settings,
      path: 'rows/:row',
      title: (routerState) => {
        const configId = routerState.getIn(['params', 'config']);
        const rowId = routerState.getIn(['params', 'row']);
        const configurationRow = ConfigurationRowsStore.get(settings.componentId, configId, rowId);
        return configurationRow.get('name') !== '' ? configurationRow.get('name') : 'Untitled ' + settings.rowItem.singular;
      },
      defaultRouteHandler: Row
    }
  );
  return route;
}

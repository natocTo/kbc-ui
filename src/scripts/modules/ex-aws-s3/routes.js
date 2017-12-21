import Index from './react/pages/Index';
import Row from './react/pages/Row';
import Credentials from './react/pages/Credentials';
import installedComponentsActions from '../components/InstalledComponentsActionCreators';
import versionsActions from '../components/VersionsActionCreators';
import jobsActions from '../jobs/ActionCreators';
import InstalledComponentsStore from '../components/stores/InstalledComponentsStore';
import ConfigurationRowsStore from '../components/stores/ConfigurationRowsStore';

const routeCreator = function(settings) {
  return {
    name: settings.componentId,
    path: ':config',
    title: (routerState) => {
      const configId = routerState.getIn(['params', 'config']);
      return InstalledComponentsStore.getConfig(settings.componentId, configId).get('name');
    },
    isComponent: true,
    componentId: settings.componentId,
    defaultRouteHandler: Index,
    poll: {
      interval: 10,
      action: (params) => jobsActions.loadComponentConfigurationLatestJobs(settings.componentId, params.config)
    },
    requireData: [
      (params) => installedComponentsActions.loadComponentConfigData(settings.componentId, params.config),
      (params) => versionsActions.loadVersions(settings.componentId, params.config)
    ],
    childRoutes: [
      {
        name: settings.componentId + '-credentials',
        path: ':config/credentials',
        title: 'Credentials',
        defaultRouteHandler: Credentials,
        componentId: settings.componentId

      },
      {
        name: settings.componentId + '-row',
        componentId: settings.componentId,
        path: ':config/:row',
        title: (routerState) => {
          const configId = routerState.getIn(['params', 'config']);
          const rowId = routerState.getIn(['params', 'row']);
          const configurationRow = ConfigurationRowsStore.get(settings.componentId, configId, rowId);
          return configurationRow.get('name') !== '' ? configurationRow.get('name') : 'Untitled';
        },
        defaultRouteHandler: Row
      }
    ]
  };
};

const routeSettings = {
  componentId: 'keboola.ex-aws-s3'
};

export default routeCreator(routeSettings);

import Index from './react/pages/Index';
import Row from './react/pages/Row';
import Credentials from './react/pages/Credentials';
import installedComponentsActions from '../components/InstalledComponentsActionCreators';
import versionsActions from '../components/VersionsActionCreators';
import jobsActions from '../jobs/ActionCreators';
import InstalledComponentsStore from '../components/stores/InstalledComponentsStore';
import ConfigurationRowsStore from '../components/stores/ConfigurationRowsStore';
import { createConfiguration as rowCreateConfiguration, parseConfiguration as rowParseConfiguration } from './adapters/row';
import { createConfiguration as credentialsCreateConfiguration, parseConfiguration as credentialsParseConfiguration } from './adapters/credentials';
import ConfigurationForm from './react/components/Configuration';
import CredentialsForm from './react/components/Credentials';

const routeCreator = function(settings) {
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
    childRoutes: [
      {
        name: settings.componentId + '-credentials',
        settings: settings,
        path: 'credentials',
        title: 'Credentials',
        defaultRouteHandler: Credentials
      },
      {
        name: settings.componentId + '-row',
        settings: settings,
        path: ':row',
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
  if (settings.hasCredentials) {
    // route.childRoutes.push();
  }
  return route;
};

const routeSettings = {
  componentId: 'keboola.ex-aws-s3',
  hasCredentials: true,
  rowItem: {
    singular: 'Table',
    plural: 'Tables'
  },
  adapters: {
    credentials: {
      create: credentialsCreateConfiguration,
      parse: credentialsParseConfiguration
    },
    row: {
      create: rowCreateConfiguration,
      parse: rowParseConfiguration
    }
  },
  components: {
    row: ConfigurationForm,
    credentials: CredentialsForm
  }
};

export default routeCreator(routeSettings);

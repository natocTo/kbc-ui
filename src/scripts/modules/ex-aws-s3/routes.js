import Index from './react/pages/Index';
import Row from './react/pages/Row';
import Credentials from './react/pages/Credentials';
import installedComponentsActions from '../components/InstalledComponentsActionCreators';
import versionsActions from '../components/VersionsActionCreators';
import jobsActions from '../jobs/ActionCreators';
import InstalledComponentsStore from '../components/stores/InstalledComponentsStore';
import ConfigRowsStore from '../components/stores/ConfigRowsStore';

const COMPONENT_ID = 'keboola.ex-aws-s3';

export default {
  name: COMPONENT_ID,
  path: ':config',
  title: (routerState) => {
    const configId = routerState.getIn(['params', 'config']);
    return InstalledComponentsStore.getConfig(COMPONENT_ID, configId).get('name');
  },
  isComponent: true,
  defaultRouteHandler: Index,
  poll: {
    interval: 10,
    action: (params) => jobsActions.loadComponentConfigurationLatestJobs(COMPONENT_ID, params.config)
  },
  requireData: [
    (params) => installedComponentsActions.loadComponentConfigData(COMPONENT_ID, params.config),
    (params) => versionsActions.loadVersions(COMPONENT_ID, params.config)
  ],
  childRoutes: [
    {
      name: COMPONENT_ID + '-credentials',
      path: ':config/credentials',
      title: 'Credentials',
      defaultRouteHandler: Credentials
    },
    {
      name: COMPONENT_ID + '-row',
      path: ':config/:row',
      title: (routerState) => {
        const configId = routerState.getIn(['params', 'config']);
        const rowId = routerState.getIn(['params', 'row']);
        const configRow = ConfigRowsStore.get(COMPONENT_ID, configId, rowId);
        return configRow.get('name') !== '' ? configRow.get('name') : 'Untitled';
      },
      defaultRouteHandler: Row
    }
  ]
};

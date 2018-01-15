import Index from './react/Index';
import installedComponentsActions from '../components/InstalledComponentsActionCreators';
import jobsActionCreators from '../jobs/ActionCreators';
import versionsActions from '../components/VersionsActionCreators';
import {createTablesRoute} from '../table-browser/routes';
// import schemasActionsCreators from '../../modules/components/TemplatesActionCreators';

const componentId = 'keboola.ex-pigeon';

export default {
  name: componentId,
  path: ':config',
  isComponent: true,
  defaultRouteHandler: Index,
  requireData: [
    (params) => installedComponentsActions.loadComponentConfigData(componentId, params.config),
    (params) => versionsActions.loadVersions(componentId, params.config)
    // (params) => schemasActionsCreators.loadSchema(componentId, params.component)
  ],
  poll: {
    interval: 7,
    action: (params) => jobsActionCreators.loadComponentConfigurationLatestJobs(componentId, params.config)
  },
  childRoutes: [ createTablesRoute(componentId)]
};

import Index from './react/Index';
import jobsActionCreators from '../jobs/ActionCreators';

const componentId = 'ex-pigeon';

export default {
  name: 'ex-pigeon',
  path: ':config',
  isComponent: true,
  defaultRouteHandler: Index,

  poll: {
    interval: 7,
    action: (params) => jobsActionCreators.loadComponentConfigurationLatestJobs(componentId, params.config)
  }

};

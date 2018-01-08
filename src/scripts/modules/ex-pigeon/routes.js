import Index from './react/Index';

import jobsActionCreators from '../jobs/ActionCreators';

export default {
  name: 'ex-pigeon',
  path: ':config',
  isComponent: true,
  requireData: [

  ],
  poll: {
    interval: 7,
    action: (params) => jobsActionCreators.loadComponentConfigurationLatestJobs('ex-pigeon', params.config)
  },
  defaultRouteHandler: Index,
  childRoutes: [
  ]
};

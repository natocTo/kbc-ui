import Index from './react/Index';

export default {
  name: 'ex-pigeon',
  path: ':config',
  isComponent: true,
  requireData: [

  ],
  poll: {
    interval: 7
  },
  defaultRouteHandler: Index
};

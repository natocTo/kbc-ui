import Index from './react/Index';
export const PATH_PREFIX = 'tables';

export default {
  name: 'tables',
  path: `${PATH_PREFIX}/:tableId`,
  defaultRouteHandler: Index
};

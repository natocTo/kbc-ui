import Index from './react/Index';
export const PATH_PREFIX = 'tables';

export const createTablesRoute = (parentRouteName) => {
  return {
    name: `${parentRouteName}-tables`,
    path: `${PATH_PREFIX}/:tableId`,
    handler: Index
  };
};

export default {
  name: 'tables',
  path: `${PATH_PREFIX}/:tableId`,
  defaultRouteHandler: Index
};

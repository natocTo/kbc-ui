import Index from './react/Index';
// import RoutesStore from '../../../stores/RoutesStore';
import tableBrowserActions from './actions';
export const PATH_PREFIX = 'tables';

const requireDataFn = (routerState) => {
  const tableId = routerState.getIn(['params', 'tableId']);
  tableBrowserActions.setCurrentTableId(tableId);
};


export const createTablesRoute = (parentRouteName) => {
  return {
    name: `${parentRouteName}-tables`,
    path: `${PATH_PREFIX}/:tableId`,
    requireData: requireDataFn,
    handler: Index
  };
};

export default {
  name: 'tables',
  path: `${PATH_PREFIX}/:tableId`,
  requireData: requireDataFn,
  defaultRouteHandler: Index
};

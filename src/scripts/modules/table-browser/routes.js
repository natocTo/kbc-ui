import Index from './react/Index';
import {initLocalState} from './utils';
import tableBrowserActions from './actions';
import storageActions from '../components/StorageActionCreators';

export const PATH_PREFIX = 'tables';

const requireDataFn = (routerState) => {
  const tableId = routerState.tableId;
  return storageActions.loadTables().then( () =>
    tableBrowserActions.setCurrentTableId(tableId, initLocalState())
  );
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

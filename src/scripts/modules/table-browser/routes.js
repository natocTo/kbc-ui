import Index from './react/Index';
import {initLocalState} from './utils';
import tableBrowserActions from './flux/actions';
import storageActions from '../components/StorageActionCreators';
import createActionsProvisioning from './actionsProvisioning';

export const PATH_PREFIX = 'tables';

const requireDataFn = (routerState) => {
  const tableId = routerState.tableId;
  return storageActions.loadTables().then( () => {
    tableBrowserActions.setCurrentTableId(tableId, initLocalState(tableId));
    createActionsProvisioning(tableId).loadAll();
  }
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

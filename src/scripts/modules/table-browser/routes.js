import Index from './react/Index';
import tableBrowserActions from './flux/actions';
import storageActions from '../components/StorageActionCreators';
import createActionsProvisioning from './actionsProvisioning';

export const PATH_PREFIX = 'tables';

const requireDataFn = (routerState) => {
  const tableId = routerState.tableId;
  return storageActions.loadTables().then( () => {
    const actions = createActionsProvisioning(tableId);
    tableBrowserActions.setCurrentTableId(tableId, actions.initLocalState(tableId));
    actions.loadAll();
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

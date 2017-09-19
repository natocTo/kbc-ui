import Index from './react/Index';
import storageActions from '../components/StorageActionCreators';

export default {
  name: 'tables',
  path: 'tables/:tableId',
  defaultRouteHandler: Index,
  requireData: [
    () => storageActions.loadTables()
  ]
};

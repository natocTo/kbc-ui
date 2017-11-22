import Index from './react/Index';
import tokensActions from './actionCreators';
import StorageActions from '../components/StorageActionCreators';

export default {
  name: 'tokens',
  title: 'Tokens',
  defaultRouteHandler: Index,
  requireData: [
    () => tokensActions.loadTokens(),
    () => StorageActions.loadBuckets()
  ]
};

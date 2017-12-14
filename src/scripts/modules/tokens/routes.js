import Index from './react/Index/Index';
import TokenDetail from './react/TokenDetail';
import tokensActions from './actionCreators';
import StorageActions from '../components/StorageActionCreators';
import TokensStore from './StorageTokensStore';

export default {
  name: 'tokens',
  title: 'Tokens',
  defaultRouteHandler: Index,
  requireData: [
    () => tokensActions.loadTokens(),
    () => StorageActions.loadBuckets()
  ],
  childRoutes: [
    {
      name: 'tokens-detail',
      path: ':tokenId',
      handler: TokenDetail,
      title: (routerState) => {
        const tokenId = routerState.getIn(['params', 'tokenId']);
        const token = tokenId && TokensStore.getAll().find(t => t.get('id') === tokenId);
        if (token) {
          return `${token.get('description')} (${token.get('id')})`;
        } else {
          return `Unknown token ${tokenId}`;
        }
      }
    }
  ]
};

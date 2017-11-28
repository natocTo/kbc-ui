import Index from './react/Index';
import TokenDetail from './react/TokenDetail';
import tokensActions from './actionCreators';
import StorageActions from '../components/StorageActionCreators';
import TokensStore from './StorageTokensStore';
import {Map} from 'immutable';

export default {
  name: 'tokens',
  title: 'Tokens',
  defaultRouteHandler: Index,
  requireData: [
    (params, query) => {
      return tokensActions.loadTokens().then(() => {
        const {tokenId} = query;
        if (tokenId) {
          const localState = TokensStore.localState();
          const token = TokensStore.getAll().find(t => t.get('id') === tokenId);
          if (!!token) {
            const manageTokenData = Map({token: token, show: true});
            const newLs = localState.setIn(['TokensTable', 'manageToken'], manageTokenData);
            tokensActions.updateLocalState(newLs);
          }
        }
      });
    },
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
          return `Token ${token.get('description')} (${token.get('id')})`;
        } else {
          return `Unknown token ${tokenId}`;
        }
      }
    }
  ]
};

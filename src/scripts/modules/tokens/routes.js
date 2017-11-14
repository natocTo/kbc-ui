import Index from './react/Index';
import tokensActions from './actionCreators';


export default {
  name: 'tokens',
  title: 'Tokens',
  defaultRouteHandler: Index,
  requireData: () => tokensActions.loadTokens()
};

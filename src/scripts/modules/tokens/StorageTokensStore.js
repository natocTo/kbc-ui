import Dispatcher from '../../Dispatcher';
import constants from './constants';

import {Map, List, fromJS} from 'immutable';
import StoreUtils from '../../utils/StoreUtils';

const ActionTypes = constants.ActionTypes;

let _store = Map({
  tokens: List(),
  isLoaded: false,
  isLoading: false,
  deletingTokens: Map()
});

const StorageTokensStore = StoreUtils.createStore({
  getAll: () => _store.get('tokens'),
  getIsLoading: () => _store.get('isLoading'),
  getIsLoaded: () =>  _store.get('isLoaded')
});


Dispatcher.register( (payload) => {
  const action = payload.action;
  switch (action.type) {
    case ActionTypes.STORAGE_TOKEN_CREATE_SUCCESS:
      const token = fromJS(action.token);
      const tokens = _store.get('tokens', List());
      _store = _store.set('tokens', tokens.push(token));
      StorageTokensStore.emitChange();
      break;
    case ActionTypes.STORAGE_TOKENS_LOAD:
      _store = _store.set('isLoading', true);
      StorageTokensStore.emitChange();
      break;
    case ActionTypes.STORAGE_TOKENS_LOAD_SUCCESS:
      _store = _store.withMutations(function(store) {
        return store.set('tokens', fromJS(action.tokens)).set('isLoading', false).set('isLoaded', true);
      });
      StorageTokensStore.emitChange();
      break;
    case ActionTypes.STORAGE_TOKEN_DELETE:
      _store = _store.setIn(['deletingTokens', action.tokenId], true);
      StorageTokensStore.emitChange();
      break;
    case ActionTypes.STORAGE_TOKEN_DELETE_SUCCESS:
      _store = _store.setIn(['deletingTokens', action.tokenId], false);
      const newTokens = _store.get('tokens').filter(function(t) {
        return t.get('id') !== action.tokenId;
      });
      _store = _store.set('tokens', newTokens);
      StorageTokensStore.emitChange();
      break;
    case ActionTypes.STORAGE_TOKENS_LOAD_ERROR:
      _store = _store.set('isLoading', false);
      StorageTokensStore.emitChange();
      break;
    default:
      break;
  }
});


export default StorageTokensStore;

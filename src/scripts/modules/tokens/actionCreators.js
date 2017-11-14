import Promise from 'bluebird';
import StorageTokensStore from './StorageTokensStore';
import storageApi from '../components/StorageApi';
import dispatcher from '../../Dispatcher';
import constants from './constants';

const ActionTypes = constants.ActionTypes;


export default {
  deleteToken(tokenObject) {
    const tokenId = tokenObject.get('id');
    dispatcher.handleViewAction({
      type: ActionTypes.STORAGE_TOKEN_DELETE,
      tokenId: tokenId
    });
    return storageApi.deleteToken(tokenId).then(() => {
      return dispatcher.handleViewAction({
        type: ActionTypes.STORAGE_TOKEN_DELETE_SUCCESS,
        tokenId: tokenId
      });
    });
  },

  loadTokensForce() {
    dispatcher.handleViewAction({
      type: ActionTypes.STORAGE_TOKENS_LOAD
    });
    return storageApi.getTokens().then((tokens) => {
      return dispatcher.handleViewAction({
        type: ActionTypes.STORAGE_TOKENS_LOAD_SUCCESS,
        tokens: tokens
      });
    }).catch(function(error) {
      dispatcher.handleViewAction({
        type: ActionTypes.STORAGE_TOKENS_LOAD_ERROR,
        errors: error
      });
      throw error;
    });
  },

  loadTokens() {
    if (StorageTokensStore.getIsLoaded()) {
      return Promise.resolve();
    }
    return this.loadTokensForce();
  },

  createToken(params) {
    return storageApi.createToken(params).then((token) => {
      return dispatcher.handleViewAction({
        type: ActionTypes.STORAGE_TOKEN_CREATE_SUCCESS,
        token: token
      });
    }).catch((error) => {
      dispatcher.handleViewAction({
        type: ActionTypes.STORAGE_TOKEN_CREATE_ERROR,
        status: error.status,
        response: error.response
      });
      throw error;
    });
  }

};

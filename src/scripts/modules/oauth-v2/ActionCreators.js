import dispatcher from '../../Dispatcher';
import Promise from 'bluebird';
import oauthStore from './Store';
import oauthApi from './Api';
import Constants from './Constants';
import Immutable from 'immutable';

/* eslint no-console: 0 */
export default {
  loadCredentials(componentId, id) {
    if (oauthStore.hasCredentials(componentId, id)) {
      return Promise.resolve();
    }
    return this.loadCredentialsForce(componentId, id);
  },

  loadCredentialsForce(componentId, id) {
    return oauthApi
      .getCredentials(componentId, id)
      .then(function(result) {
        dispatcher.handleViewAction({
          type: Constants.ActionTypes.OAUTHV2_LOAD_CREDENTIALS_SUCCESS,
          componentId,
          id,
          credentials: Immutable.fromJS(result)
        });
        return result;
      })
      .catch(function(err) {
        console.log('GET CREDENTIALS API ERROR', err);
        return dispatcher.handleViewAction({
          type: Constants.ActionTypes.OAUTHV2_LOAD_CREDENTIALS_ERROR,
          componentId,
          id
        });
      });
  },

  postCredentials(componentId, id, authorizedFor, data) {
    dispatcher.handleViewAction({
      type: Constants.ActionTypes.OAUTHV2_POST_CREDENTIALS_START,
      componentId,
      id
    });

    return oauthApi
      .postCredentials(componentId, id, authorizedFor, data)
      .then(result =>
        dispatcher.handleViewAction({
          type: Constants.ActionTypes.OAUTHV2_POST_CREDENTIALS_SUCCESS,
          componentId,
          id,
          credentials: Immutable.fromJS(result)
        })
      )
      .catch(function(err) {
        console.log('POST CREDENTIALS API ERROR', err);
        return dispatcher.handleViewAction({
          type: Constants.ActionTypes.OAUTHV2_API_ERROR,
          componentId,
          id
        });
      });
  },

  deleteCredentials(componentId, id) {
    dispatcher.handleViewAction({
      type: Constants.ActionTypes.OAUTHV2_DELETE_CREDENTIALS_START,
      componentId,
      id
    });

    return oauthApi
      .deleteCredentials(componentId, id)
      .then(result =>
        dispatcher.handleViewAction({
          type: Constants.ActionTypes.OAUTHV2_DELETE_CREDENTIALS_SUCCESS,
          componentId,
          id,
          credentials: result
        })
      )
      .catch(function(err) {
        console.log('DELETE CREDENTIALS API ERROR', err);
        return dispatcher.handleViewAction({
          type: Constants.ActionTypes.OAUTHV2_API_ERROR,
          componentId,
          id
        });
      });
  }
};


import dispatcher from '../../Dispatcher';
import storageApi from './storageApi';

import StorageTablesStore from './stores/StorageTablesStore';
import StorageBucketsStore from './stores/StorageBucketsStore';

import constants from './Constants';
import {fromJS} from 'immutable';

module.exports = {

  getMetadata: function(objectType, objectId, provider) {
    switch (objectType) {
      case 'bucket':
        return StorageBucketsStore.getBucketMetadata(objectId).then(function(result) {
          return fromJS(result).getIn('provider', provider);
        });
      case 'table':
        return StorageTablesStore.getTableMetadata(objectId).then(function(result) {
          return fromJS(result).getIn('provider', provider);
        });
      case 'column':
        return StorageTablesStore.getColumnMetadata(objectId).then(function(result) {
          return fromJS(result).getIn('provider', provider);
        });
      default:
    }
  },

  saveBucketMetadata: function(bucketId, data) {
    dispatcher.handleViewAction({
      objectType: 'bucket',
      objectId: bucketId,
      data: data,
      type: constants.ActionTypes.METADATA_SAVE_START
    });
    return storageApi.saveBucketMetadata(bucketId, data).then(function(metadata) {
      dispatcher.handleViewAction({
        type: constants.ActionTypes.METADATA_SAVE_SUCCESS,
        objectType: 'bucket',
        objectId: bucketId,
        data: data
      });
      return metadata;
    }).catch(function(error) {
      dispatcher.handleViewAction({
        type: constants.ActionTypes.METADATA_SAVE_ERROR,
        objectType: 'bucket',
        objectId: bucketId,
        data: data
      });
      throw error;
    });
  },

  saveTableMetadata: function(tableId, data) {
    dispatcher.handleViewAction({
      objectType: 'table',
      objectId: tableId,
      data: data,
      type: constants.ActionTypes.METADATA_SAVE_START
    });
    return storageApi.saveTableMetadata(tableId, data).then(function(metadata) {
      dispatcher.handleViewAction({
        type: constants.ActionTypes.METADATA_SAVE_SUCCESS,
        objectType: 'table',
        objectId: tableId,
        data: data
      });
      return metadata;
    }).catch(function(error) {
      dispatcher.handleViewAction({
        type: constants.ActionTypes.METADATA_SAVE_ERROR,
        objectType: 'table',
        objectId: tableId,
        data: data
      });
      throw error;
    });
  },

  saveColumnMetadata: function(columnId, data) {
    dispatcher.handleViewAction({
      objectType: 'column',
      objectId: columnId,
      data: data,
      type: constants.ActionTypes.METADATA_EDIT_SAVE
    });
    return storageApi.saveColumnMetadata(columnId, data).then(function(metadata) {
      dispatcher.handleViewAction({
        type: constants.ActionTypes.METADATA_EDIT_SAVE_SUCCESS,
        objectType: 'column',
        objectId: columnId,
        data: data
      });
      return metadata;
    }).catch(function(error) {
      dispatcher.handleViewAction({
        type: constants.ActionTypes.METADATA_EDIT_SAVE_ERROR,
        objectType: 'column',
        objectId: columnId,
        data: data
      });
      throw error;
    });
  }
};

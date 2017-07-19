

import MetadataStore from './stores/MetadataStore';
import StorageTablesStore from './stores/StorageTablesStore';
import StorageBucketsStore from './stores/StorageBucketsStore';

module.exports = {

  loadTableMetadata: function (tableId, provider) {
    if (MetadataStore.hasMetadata('table', tableId, provider)) {
      this.loadMetadataForce('table', tableId, provider);
      return Promise.resolve();
    }
    return this.loadMetadataForce('table', tableId, provider);
  },

  loadBucketMetadata: function (bucketId, provider) {
    if (MetadataStore.hasMetadata('bucket', bucketId, provider)) {
      this.loadMetadataForce('bucket', bucketId, provider);
      return Promise.resolve();
    }
    return this.loadMetadataForce('bucket', bucketId, provider);
  },

  getColumnMetadata: function (tableId, column, provider) {
    if (MetadataStore.hasMetadata('column', columnId, provider)) {
      this.getMetadata('column', columnId, provider);
      return Promise.resolve();
    }
    return this.loadMetadataForce('column', columnId, provider);
  },

  getMetadata: function(objectType, objectId, provider) {
    switch (objectType) {
      case 'bucket':
        return StorageBucketsStore.getBucketMetadata(objectId).then(function(result) {
          byProvider = fromJS(result).getIn('provider', provider);
          dispatcher.handleViewAction({
            objectType: 'bucket',
            objectId: objectId,
            provider: provider,
            type: Constants.ActionTypes.METADATA_LOAD_SUCCESS
          });
          return byProvider;
        }).catch(function(error) {
          dispatcher.handleViewAction({
            objectType: 'bucket',
            configId: objectId,
            provider: provider,
            type: Constants.ActionTypes.METADATA_LOAD_ERROR
          });
        });
        break;
      case 'table':


    }
    bucketMetadata = ;
    tableMetadata = StorageTablesStore.getTableMetadata(tableId).then(function(result) {
      dispatcher.handleViewAction({
        objectType: objectType,
        objectId: objectId,
        type: Constants.ActionTypes.METADATA_LOAD_SUCCESS,
        metadata: result
      });
      return result;
    }).catch(function(error) {
      dispatcher.handleViewAction({
        objectType: objectType,
        configId: configId,
        type: Constants.ActionTypes.METADATA_LOAD_ERROR
      });
      throw error;
    });
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

  saveTableMetadata: function(bucketId, data) {
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

  saveColumnMetadata: function(bucketId, data) {
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

import StoreUtils from '../../../utils/StoreUtils';
import Immutable from 'immutable';
import dispatcher from '../../../Dispatcher';
import MetadataConstants from '../MetadataConstants';
import Constants from '../Constants';

import _ from 'underscore';

var Map = Immutable.Map;

var _store = Map({
  savingMetadata: Map(),
  editingMetadata: Map(),
  metadata: Map(),

  filters: Map()
});

var MetadataStore = StoreUtils.createStore({


  getColumnMetadata: function(tableId, column, provider, metadataKey) {
    if (!this.hasMetadata('column', tableId + '.' + column)) {
      return false;
    }
    return this.getAllColumnMetadata(tableId, column).find(metadata =>  metadata.get('provider') === provider && metadata.get('key') === metadataKey);
  },

  getAllColumnMetadata: function(tableId, column) {
    return this.getMetadataAll('column', tableId + '.' + column);
  },

  getMetadata: function(objectType, objectId, provider, metadataKey) {
    if (this.hasMetadata(objectType, objectId)) {
      return this.getMetadataAll(objectType, objectId).find(metadata =>  metadata.get('provider') === provider && metadata.get('key') === metadataKey);
    } else {
      return false;
    }
  },

  hasMetadata: function(objectType, objectId) {
    return _store.has('metadata', objectType, objectId);
  },

  getMetadataAll: function(objectType, objectId) {
    return _store.get(['metadata', objectType, objectId]);
  },

  /*
  getMetadataByProvider: function(objectType, objectId, provider) {
    objectMetadata = this.getMetadata(objectType, objectId);
    objectMetadata.find(metadata =>  metadata.get('provider') === provider && metadata.get('key') === metadataKey)
  },
  */

  getMetadataValue: function(objectType, objectId, provider, metadataKey) {
    return this.getMetadata(objectType, objectId, provider, metadataKey).get('value');
  },

  getEditingMetadataValue: function(objectType, objectId, provider, metadataKey) {
    return _store.getIn(['editingMetadata', objectType, objectId, provider, metadataKey]).get('value');
  },

  isEditingMetadata: function(objectType, objectId, metadataKey, provider = 'user') {
    return _store.hasIn(['editingMetadata', objectType, objectId, provider, metadataKey]);
  },

  isSavingMetadata: function(objectType, objectId, metadataKey, provider = 'user') {
    return _store.hasIn(['savingMetadata', objectType, objectId, provider, metadataKey]);
  }

});

dispatcher.register(function(payload) {
  var action;
  action = payload.action;

  switch (action.type) {

    case MetadataConstants.ActionTypes.METADATA_EDIT_START:
      _store = _store.setIn(['editingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();

    case MetadataConstants.ActionTypes.METADATA_EDIT_STOP:
      _store = _store.deleteIn(['editingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();

    case MetadataConstants.ActionTypes.METADATA_EDIT_CANCEL:
      _store = _store.deleteIn(['editingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();

    case MetadataConstants.ActionTypes.METADATA_SAVE_START:
      _store = _store.setIn(['savingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();

    case MetadataConstants.ActionTypes.METADATA_SAVE_ERROR:
      return MetadataStore.emitChange();

    case MetadataConstants.ActionTypes.METADATA_SAVE_SUCCESS:
      _store = _store.setIn(['metadata', action.objectType, action.objectId], Immutable.fromJS(action.metadata));
      _store = _store.deleteIn(['savingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();

    case Constants.ActionTypes.STORAGE_TABLES_LOAD_SUCCESS:
      _.each(action.tables, function(table) {
        const tableMetadata = Immutable.fromJS(table.metadata);
        _store = _store.setIn(
          ['metadata', 'table', table.id, tableMetadata]
        );
        _.each(table.columnMetadata, function(metadata, columnName) {
          _store = _store.setIn(
            ['metadata', 'column', table.id + '.' + columnName, Immutable.fromJS(metadata)]
          );
        });
      });
      return MetadataStore.emitChange();
    default:

  }
});

module.exports = MetadataStore;

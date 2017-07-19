import StoreUtils from '../../../utils/StoreUtils';
import Immutable from 'immutable';
import dispatcher from '../../../Dispatcher';
import Constants from '../MetadataConstants';

import StorageTablesStore from '../stores/StorageTablesStore';
import StorageBucketsStore from '../stores/StorageBucketsStore';

var Map = Immutable.Map, List = Immutable.List;

var _store = Map({
  savingMetadata: Map(),
  editingMetadata: Map(),
  metadata: Map(), // objectType, objectId, provider

  filters: Map()
});

var MetadataStore = StoreUtils.createStore({

  gatTableMetadata: function(tableId, metadataKey, provider='user') {
    return _store.getIn(['metadata', 'table', tableId, provider, metadataKey]).get('value');
  },

  getTableMetadataValue: function(tableId, metadataKey, provider='user') {
    return _store.getIn(['metadata', 'table', tableId, provider, metadataKey]);
  },

  getColumnMetadata: function(columnId, metadataKey, provider='user') {
    return _store.getIn(['metadata', 'column', tableId, provider, metadataKey]);
  },

  isEditingMetadata: function(objectType, objectId, metadataKey, provider='user') {
    return _store.hasIn(['editingMetadata', objectType, objectId, provider, metadataKey]);
  },

  isSavingMetadta: function(objectType, objectId, metadataKey, provider='user') {
    return _store.hasIn(['savingMetadata', objectType, objectId, provider, metadataKey]);
  }

});

dispatcher.register(function(payload) {
  var action;
  action = payload.action;

  switch (action.type) {

    case Constants.ActionTypes.METADATA_EDIT_START:
      _store = _store.setIn(['editingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();

    case Constants.ActionTypes.METADATA_EDIT_STOP:
      _store = _store.deleteIn(['editingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();

    case Constants.ActionTypes.METADATA_EDIT_CANCEL:
      _store = _store.deleteIn(['editingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();

    case Constants.ActionTypes.METADATA_SAVE_START:
      _store = _store.setIn(['savingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();
      break;

    case ConstantsActionTypes.METADATA_SAVE_ERROR:
      return MetadataStore.emitChange();

    case ConstantsActionTypes.METADATA_SAVE_SUCCESS:
      _store = _store.setIn(['metadata', action.objectType, action.objectId, 'user'], Immutable.fromJS(action.metadata));
      _store = _store.deleteIn(['savingMetadata', action.objectType, action.objectId, action.metadataKey]);
      return MetadataStore.emitChange();
    default:
  }
});

import StoreUtils from '../../utils/StoreUtils';
import {Map} from 'immutable';
import Immutable from 'immutable';
import dispatcher from '../../Dispatcher';
import Constants from './Constants';

var _store = Map({
  services: Map()
});

const ServicesStore = StoreUtils.createStore({
  getService: function(serviceId) {
    return _store.getIn(['services', serviceId]);
  }
});

dispatcher.register(function(payload) {
  var action = payload.action;

  switch (action.type) {
    case Constants.ActionTypes.SERVICES_LOAD_SUCCESS:
      action.services.forEach(function(service) {
        _store = _store.setIn(['services', service.id], Immutable.fromJS(service));
      });
      return ServicesStore.emitChange();
    default:
  }
});

module.exports = ServicesStore;

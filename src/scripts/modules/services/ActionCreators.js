import dispatcher from '../../Dispatcher';
import constants from './Constants';

module.exports = {
  receive: function(servicesRaw) {
    return dispatcher.handleViewAction({
      type: constants.ActionTypes.SERVICES_LOAD_SUCCESS,
      services: servicesRaw
    });
  }
};

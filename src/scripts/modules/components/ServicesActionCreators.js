import dispatcher from '../../Dispatcher';
import constants from './ServicesConstants';

module.exports = {
  receiveAllServices: function(servicesRaw) {
    return dispatcher.handleViewAction({
      type: constants.ActionTypes.SERVICES_LOAD_SUCCESS,
      services: servicesRaw
    });
  }
};

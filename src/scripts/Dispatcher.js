import { Dispatcher } from 'flux';
import { PayloadSources } from './constants/KbcConstants';

class KbcDispatcher extends Dispatcher {
  handleViewAction(action) {
    if (action.path) {
      console.log('dispatch', action.type, action.path); // eslint-disable-line
    } else {
      console.log('dispatch', action.type); // eslint-disable-line
    }

    return this.dispatch({
      source: PayloadSources.VIEW_ACTION,
      action
    });
  }
}

module.exports = new KbcDispatcher();

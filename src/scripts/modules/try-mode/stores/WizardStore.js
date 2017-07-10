import Dispatcher from '../../../Dispatcher';
import StoreUtils from '../../../utils/StoreUtils';

let store = {
  showLessonModal: false,
  lessonNumber: 0
};

const ActionTypes = {
  UPDATE_WIZARD_MODAL_STATE: 'UPDATE_WIZARD_MODAL_STATE'
};

const WizardStore = StoreUtils.createStore({
  getState() {
    return store;
  }
});

Dispatcher.register((payload) => {
  let action = payload.action;

  switch (action.type) {
    case ActionTypes.UPDATE_WIZARD_MODAL_STATE:
      store = {
        showLessonModal: action.showLessonModal,
        lessonNumber: action.lessonNumber
      };
      return WizardStore.emitChange();
    default:
  }
});

export default WizardStore;
import Dispatcher from '../../Dispatcher';
import StoreUtils from '../../utils/StoreUtils';

const ActionTypes = {
  UPDATE_WIZARD_MODAL_STATE: 'UPDATE_WIZARD_MODAL_STATE'
};

let store = {
  showLessonModal: false,
  lessonNumber: 0
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

export const hideWizardModalFn = () => {
  Dispatcher.handleViewAction({
    type: ActionTypes.UPDATE_WIZARD_MODAL_STATE,
    showLessonModal: false,
    lessonNumber: 0
  });
};

export const showWizardModalFn = (lessonNumber) => {
  return Dispatcher.handleViewAction({
    type: ActionTypes.UPDATE_WIZARD_MODAL_STATE,
    showLessonModal: true,
    lessonNumber: lessonNumber
  });
};

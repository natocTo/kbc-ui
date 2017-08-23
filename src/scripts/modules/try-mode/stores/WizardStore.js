import Dispatcher from '../../../Dispatcher';
import StoreUtils from '../../../utils/StoreUtils';

let store = {
  showLessonModal: false,
  lessonNumber: 0,
  nextStepAction: null,
  nextActionOccured: false
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
  if (store.nextStepAction && action.type === store.nextStepAction.action) {
    const nextAction = store.nextStepAction;
    const isNextAction = Object.keys(store.nextStepAction).reduce((memo, key) => memo && nextAction[key] === action[key], true);
    if (isNextAction) {
      store.nextStepAction = null;
      store.nextActionOccured = true;
      // todo - tu musi byt step++ preniest zo stavgu modalu
      WizardStore.emitChange();
    }
  }
  switch (action.type) {
    case ActionTypes.TRY_WIZARD_NEXT_ACTION_REGISTER:
      store.nextStepAction = action.action;
      return WizardStore.emitChange();
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

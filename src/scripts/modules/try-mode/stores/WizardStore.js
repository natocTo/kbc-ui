import Dispatcher from '../../../Dispatcher';
import StoreUtils from '../../../utils/StoreUtils';
import {ActionTypes} from './ActionCreators';
import wizardLessons from '../WizardLessons.json';

let store = {
  showLessonModal: false,
  lessonNumber: 0,
  step: 1
};


const WizardStore = StoreUtils.createStore({
  getState: () => store,
  getCurrentLesson: () => wizardLessons[store.lessonNumber]
});

Dispatcher.register((payload) => {
  let action = payload.action;
  if (store.nextStepAction && action.type === store.nextStepAction.action) {
    const nextAction = store.nextStepAction;
    const isNextAction = Object.keys(store.nextStepAction).reduce((memo, key) => memo && nextAction[key] === action[key], true);
    if (isNextAction) {
      store.nextStepAction = null;
      store.step++;
      // todo - tu musi byt step++ preniest zo stavgu modalu
      WizardStore.emitChange();
    }
  }
  switch (action.type) {
    case ActionTypes.TRY_WIZARD_SET_STEP:
      store.step = action.step;
      return WizardStore.emitChange();
    case ActionTypes.UPDATE_WIZARD_MODAL_STATE:
      store = {
        showLessonModal: action.showLessonModal,
        lessonNumber: action.lessonNumber,
        step: action.showLessonModal ? store.step : 1
      };
      return WizardStore.emitChange();
    default:
  }
});

export default WizardStore;

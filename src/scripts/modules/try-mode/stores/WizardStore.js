import Dispatcher from '../../../Dispatcher';
import StoreUtils from '../../../utils/StoreUtils';
import {ActionTypes} from './ActionCreators';
import wizardLessons from '../WizardLessons';

let store = {
  showLessonModal: false,
  lessonNumber: 0,
  step: 0
};

const containsAction = (dispatchedAction, action) => {
  return Object.keys(action).reduce(
    (memo, key) => memo && dispatchedAction[key] && dispatchedAction[key] === action[key]
    , true);
};

const WizardStore = StoreUtils.createStore({
  getState: () => store,
  getCurrentLesson: () => wizardLessons[store.lessonNumber],
  getCurrentStep: () => {
    const lesson = wizardLessons[store.lessonNumber];
    return lesson ? lesson.steps[store.step] || {} : {};
  }
});

Dispatcher.register((payload) => {
  let action = payload.action;
  const  nextStepDispatchAction = WizardStore.getCurrentStep().nextStepDispatchAction;
  if (nextStepDispatchAction && containsAction(action, nextStepDispatchAction)) {
    store.step = store.step + 1;
    return WizardStore.emitChange();
  }

  switch (action.type) {
    case ActionTypes.TRY_WIZARD_SET_STEP:
      store.step = action.step;
      return WizardStore.emitChange();
    case ActionTypes.UPDATE_WIZARD_MODAL_STATE:
      store = {
        showLessonModal: action.showLessonModal,
        lessonNumber: action.lessonNumber,
        step: action.showLessonModal ? store.step : 0
      };
      return WizardStore.emitChange();
    default:
  }
});

export default WizardStore;

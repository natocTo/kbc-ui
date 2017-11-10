import objectAssign from 'object-assign';

import Dispatcher from '../../../Dispatcher';
import StoreUtils from '../../../utils/StoreUtils';
import { ActionTypes } from './ActionCreators';
import wizardLessons from '../WizardLessons';
import RoutesStore from '../../../stores/RoutesStore';

const LOCAL_STORAGE_KEY = 'kbc-ui-guide-mode';

const store = {
  showLessonModal: false,
  lessonNumber: 0,
  step: 0,
  achievedStep: 0,
  achievedLesson: 0
};

export const getStateFromLocalStorage = () => {
  const value = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  return value ? JSON.parse(value) : store;
};

export const setStateToLocalStorage = (value) => {
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
};

const containsAction = (dispatchedAction, action) => {
  return Object.keys(action).reduce(
    (memo, key) => memo && dispatchedAction[key] && dispatchedAction[key] === action[key]
    , true);
};

const getMaxStep = (currentStepId) => {
  return Math.max(currentStepId, getStateFromLocalStorage().achievedStep);
};

const WizardStore = StoreUtils.createStore({
  getState: () => {
    return getStateFromLocalStorage();
  },
  getCurrentLesson: () => {
    return wizardLessons[getStateFromLocalStorage().lessonNumber];
  },
  getNextLink: () => {
    const localStorageState = getStateFromLocalStorage();
    const lesson = wizardLessons[localStorageState.lessonNumber];
    const nextStep = lesson ? lesson.steps[localStorageState.step] || {} : {};
    const nextLink = nextStep.link;
    const matchLink = nextStep.matchLink;
    if (nextLink) {
      return nextLink;
    }
    if (matchLink) {
      const router = RoutesStore.getRouter();
      const path = router.getCurrentPath();
      const nextPathMatch = path.match(matchLink);
      const nextPath = nextPathMatch ? nextPathMatch[0] : null;
      return nextPath;
    }
    return null;
  },

  getCurrentStep: () => {
    const localStorageState = getStateFromLocalStorage();
    const lesson = wizardLessons[localStorageState.lessonNumber];
    return lesson ? lesson.steps[localStorageState.step] || {} : {};
  }
});

Dispatcher.register((payload) => {
  let action = payload.action;
  const  nextStepDispatchAction = WizardStore.getCurrentStep().nextStepDispatchAction;
  if (nextStepDispatchAction && containsAction(action, nextStepDispatchAction)) {
    const localStorageState = getStateFromLocalStorage();
    setStateToLocalStorage(
      objectAssign(localStorageState, {step: localStorageState.step + 1})
    );
    WizardStore.emitChange();
    const nextLink = WizardStore.getNextLink();
    if (nextLink) {
      RoutesStore.getRouter().transitionTo(nextLink);
    }
    return null;
  }

  switch (action.type) {
    case ActionTypes.GUIDE_WIZARD_SET_STEP: {
      const localStorageState = getStateFromLocalStorage();
      setStateToLocalStorage(
        objectAssign(localStorageState, {
          step: action.step,
          achievedStep: getMaxStep(action.step),
          achievedLesson: getStateFromLocalStorage().achievedLesson
        })
      );
      return WizardStore.emitChange();
    }
    case ActionTypes.UPDATE_WIZARD_MODAL_STATE: {
      const localStorageState = getStateFromLocalStorage();
      setStateToLocalStorage({
        showLessonModal: action.showLessonModal,
        lessonNumber: action.lessonNumber,
        step: action.showLessonModal ? localStorageState.step : 0,
        achievedLesson: localStorageState.achievedLesson
      });
      return WizardStore.emitChange();
    }
    default:
  }
});

export default WizardStore;

import Dispatcher from '../../../Dispatcher';
import { getStateFromLocalStorage, setStateToLocalStorage } from './WizardStore';
import objectAssign from 'object-assign';

export const ActionTypes = {
  UPDATE_WIZARD_MODAL_STATE: 'UPDATE_WIZARD_MODAL_STATE',
  DISABLE_GUIDE_MODE: 'DISABLE_GUIDE_MODE',
  GUIDE_WIZARD_SET_STEP: 'GUIDE_WIZARD_SET_STEP'
};

export const getAchievedLesson = () => {
  return getStateFromLocalStorage().achievedLesson;
};
export const setAchievedLesson = (currentLessonId) => {
  const localStorageState = getStateFromLocalStorage();
  setStateToLocalStorage(
    objectAssign(localStorageState, {
      achievedLesson: Math.max(currentLessonId, localStorageState.achievedLesson)
    })
  );
};
export const getAchievedStep = () => {
  return getStateFromLocalStorage().achievedStep;
};
export const hideWizardModalFn = () => {
  Dispatcher.handleViewAction({
    type: ActionTypes.UPDATE_WIZARD_MODAL_STATE,
    showLessonModal: false,
    lessonNumber: 0
  });
};

export const setStep = (newStep) => {
  Dispatcher.handleViewAction({
    type: ActionTypes.GUIDE_WIZARD_SET_STEP,
    step: newStep
  });
};

export const showWizardModalFn = (lessonNumber) => {
  return Dispatcher.handleViewAction({
    type: ActionTypes.UPDATE_WIZARD_MODAL_STATE,
    showLessonModal: true,
    lessonNumber: lessonNumber
  });
};

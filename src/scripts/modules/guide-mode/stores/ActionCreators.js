import Dispatcher from '../../../Dispatcher';
import { getStateFromLocalStorage, setStateToLocalStorage } from './WizardStore';
import RoutesStore from '../../../stores/RoutesStore';
import wizardLessons from '../WizardLessons';
import objectAssign from 'object-assign';

export const ActionTypes = {
  UPDATE_WIZARD_MODAL_STATE: 'UPDATE_WIZARD_MODAL_STATE',
  DISABLE_GUIDE_MODE: 'DISABLE_GUIDE_MODE',
  GUIDE_WIZARD_SET_STEP: 'GUIDE_WIZARD_SET_STEP'
};

const getCurrentLessonNumber = () => {
  return getStateFromLocalStorage().lessonNumber;
};
const getCurrentStepIndex = () => {
  return getStateFromLocalStorage().step;
};
const getStepLink = (stepIndex) => {
  return wizardLessons[getCurrentLessonNumber()].steps[stepIndex].link;
};
const getNextStepDispatchLink = (stepIndex) => {
  return wizardLessons[getCurrentLessonNumber()].steps[stepIndex].nextStepDispatchAction;
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
  const nextLink = getStepLink(newStep);
  const currentLink = getStepLink(getCurrentStepIndex());
  const nextStepDispatchLink = getNextStepDispatchLink(getCurrentStepIndex());
  const isStorageLink = () => {
    return nextLink !== 'storage' && currentLink !== 'storage' && typeof nextStepDispatchLink === 'undefined';
  };

  Dispatcher.handleViewAction({
    type: ActionTypes.GUIDE_WIZARD_SET_STEP,
    step: newStep
  });

  // use router.transitionTo only in kbc-ui app
  if (isStorageLink()) {
    return RoutesStore.getRouter().transitionTo(nextLink);
  }
};

export const showWizardModalFn = (lessonNumber) => {
  return Dispatcher.handleViewAction({
    type: ActionTypes.UPDATE_WIZARD_MODAL_STATE,
    showLessonModal: true,
    lessonNumber: lessonNumber
  });
};

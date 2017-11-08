import Dispatcher from '../../../Dispatcher';
import { getStateFromLocalStorage } from './WizardStore';
import RoutesStore from '../../../stores/RoutesStore';
import wizardLessons from '../WizardLessons';

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

  Dispatcher.handleViewAction({
    type: ActionTypes.GUIDE_WIZARD_SET_STEP,
    step: newStep
  });

  // use router.transitionTo only in kbc-ui app
  if (nextLink !== 'storage' && currentLink !== 'storage') {
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

import Dispatcher from '../../../Dispatcher';
import WizardStore from './WizardStore';
import RoutesStore from '../../../stores/RoutesStore';

export const ActionTypes = {
  UPDATE_WIZARD_MODAL_STATE: 'UPDATE_WIZARD_MODAL_STATE',
  DISABLE_TRY_MODE: 'DISABLE_TRY_MODE',
  TRY_WIZARD_SET_STEP: 'TRY_WIZARD_SET_STEP'
};

export const disableTryMode = () => {
  Dispatcher.handleViewAction({
    type: ActionTypes.DISABLE_TRY_MODE,
    projectHasTryModeOn: 0
  });
  return false;
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
    type: ActionTypes.TRY_WIZARD_SET_STEP,
    step: newStep
  });
  const nextLink = WizardStore.getCurrentStep().link;
  if (nextLink) {
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

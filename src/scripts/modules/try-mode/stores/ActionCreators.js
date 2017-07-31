import Dispatcher from '../../../Dispatcher';

const ActionTypes = {
  UPDATE_WIZARD_MODAL_STATE: 'UPDATE_WIZARD_MODAL_STATE',
  DISABLE_TRY_MODE: 'DISABLE_TRY_MODE'
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

export const showWizardModalFn = (lessonNumber) => {
  return Dispatcher.handleViewAction({
    type: ActionTypes.UPDATE_WIZARD_MODAL_STATE,
    showLessonModal: true,
    lessonNumber: lessonNumber
  });
};
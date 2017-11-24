import objectAssign from 'object-assign';

import Dispatcher from '../../../Dispatcher';
import StoreUtils from '../../../utils/StoreUtils';
import { ActionTypes } from './ActionCreators';
import wizardLessons from '../WizardLessons';

import { ActionTypes as componentsActionTypes } from '../../components/Constants';
import { ActionTypes as jobActionTypes } from '../../jobs/Constants';
import { ActionTypes as transformationsActionTypes } from '../../transformations/Constants';
import { ActionTypes as orchestrationsActionTypes } from '../../orchestrations/Constants';
import ApplicationStore from '../../../stores/ApplicationStore';

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

const getMaxStep = (currentStepId) => {
  return Math.max(currentStepId, getStateFromLocalStorage().achievedStep);
};

const WizardStore = StoreUtils.createStore({
  getState: () => {
    return getStateFromLocalStorage();
  },
  hasLessonOn: () => {
    const localStorageState = getStateFromLocalStorage();
    return localStorageState.lessonNumber > 0;
  },
  getAchievedLessonId: () => {
    return getStateFromLocalStorage().achievedLesson;
  },
  getCurrentLesson: () => {
    return wizardLessons[getStateFromLocalStorage().lessonNumber];
  },
  getCurrentStep: () => {
    const localStorageState = getStateFromLocalStorage();
    const lesson = wizardLessons[localStorageState.lessonNumber];
    return lesson ? lesson.steps[localStorageState.step] || {} : {};
  }
});

Dispatcher.register((payload) => {
  if (ApplicationStore.getKbcVars().get('projectHasGuideModeOn')) {
    const action = payload.action;
    const localStorageState = getStateFromLocalStorage();

    switch (action.type) {
      case ActionTypes.GUIDE_MODE_SET_STEP:
        setStateToLocalStorage(
          objectAssign(localStorageState, {
            step: action.step,
            achievedStep: getMaxStep(action.step)
          })
        );
        WizardStore.emitChange();
        break;
      case ActionTypes.GUIDE_MODE_SET_ACHIEVED_LESSON:
        setStateToLocalStorage(
          objectAssign(localStorageState, {
            achievedLesson: Math.max(action.lessonId, localStorageState.achievedLesson)
          })
        );
        WizardStore.emitChange();
        break;
      case ActionTypes.GUIDE_MODE_UPDATE_MODAL_STATE:
        setStateToLocalStorage(objectAssign(localStorageState, {
          showLessonModal: action.showLessonModal,
          lessonNumber: action.lessonNumber,
          step: action.showLessonModal ? localStorageState.step : 0,
          achievedStep: action.showLessonModal ? localStorageState.step : 0
        }));
        WizardStore.emitChange();
        break;
      default:
    }
  }
});

Dispatcher.register((payload) => {
  if (ApplicationStore.getKbcVars().get('projectHasGuideModeOn') && WizardStore.hasLessonOn()) {
    const action = payload.action;
    const localStorageState = getStateFromLocalStorage();

    const saveAndEmit = (stepId) => {
      setStateToLocalStorage(
        objectAssign(localStorageState, {
          step: stepId - 1, // step index
          achievedStep: stepId - 1 // step index
        })
      );
      WizardStore.emitChange();
    };

    switch (action.type) {
      case componentsActionTypes.COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 2 && WizardStore.getCurrentStep().id === 2 && action.componentId === 'keboola.ex-db-snowflake') {
          saveAndEmit(3);
        } else if (WizardStore.getCurrentLesson().id === 4 && WizardStore.getCurrentStep().id === 2 && action.componentId === 'tde-exporter') {
          saveAndEmit(3);
        }
        break;
      case componentsActionTypes.INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 2 && WizardStore.getCurrentStep().id === 3 && action.componentId === 'keboola.ex-db-snowflake') {
          saveAndEmit(4);
        } else if (WizardStore.getCurrentLesson().id === 2 && WizardStore.getCurrentStep().id === 4 && action.componentId === 'keboola.ex-db-snowflake') {
          saveAndEmit(5);
        }
        break;
      case componentsActionTypes.INSTALLED_COMPONENTS_CONFIGSDATA_LOAD_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 1 && WizardStore.getCurrentStep().id === 3) {
          saveAndEmit(4);
        } else if (WizardStore.getCurrentLesson().id === 2 && WizardStore.getCurrentStep().id === 6) {
          saveAndEmit(7);
        } else if (WizardStore.getCurrentLesson().id === 3 && WizardStore.getCurrentStep().id === 7) {
          saveAndEmit(8);
        }
        break;
      case jobActionTypes.JOB_LOAD_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 3 && WizardStore.getCurrentStep().id === 5) {
          saveAndEmit(6);
        } else if (WizardStore.getCurrentLesson().id === 4 && WizardStore.getCurrentStep().id === 3) {
          saveAndEmit(4);
        }
        break;
      case transformationsActionTypes.TRANSFORMATION_BUCKET_CREATE_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 3 && WizardStore.getCurrentStep().id === 2) {
          saveAndEmit(3);
        }
        break;
      case transformationsActionTypes.TRANSFORMATION_CREATE_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 3 && WizardStore.getCurrentStep().id === 3) {
          saveAndEmit(4);
        }
        break;
      case orchestrationsActionTypes.ORCHESTRATION_CREATE_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 5 && WizardStore.getCurrentStep().id === 2) {
          saveAndEmit(3);
        }
        break;
      case orchestrationsActionTypes.ORCHESTRATION_TASKS_EDIT_START:
        if (WizardStore.getCurrentLesson().id === 5 && WizardStore.getCurrentStep().id === 3) {
          saveAndEmit(4);
        }
        break;
      case orchestrationsActionTypes.ORCHESTRATION_TASKS_SAVE_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 5 && WizardStore.getCurrentStep().id === 4) {
          saveAndEmit(5);
        }
        break;
      case orchestrationsActionTypes.ORCHESTRATION_LOAD_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 5 && WizardStore.getCurrentStep().id === 5) {
          saveAndEmit(6);
        }
        break;
      case orchestrationsActionTypes.ORCHESTRATION_FIELD_SAVE_SUCCESS:
        if (WizardStore.getCurrentLesson().id === 5 && WizardStore.getCurrentStep().id === 6) {
          saveAndEmit(7);
        }
        break;
      default:
    }
  }
});

export default WizardStore;

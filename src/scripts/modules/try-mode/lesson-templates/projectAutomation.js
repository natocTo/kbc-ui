import OrchestrationsConstants from '../../orchestrations/Constants';

const {ORCHESTRATION_CREATE_SUCCESS, ORCHESTRATION_TASKS_EDIT_START, ORCHESTRATION_TASKS_SAVE_SUCCESS} = OrchestrationsConstants.ActionTypes;

export default {
  'id': 5,
  'title': 'Project Automation',
  'steps': [
    {
      'id': 1,
      'position': 'center',
      'backdrop': true,
      'title': 'Introduction',
      'link': 'home',
      'isNavigationVisible': true,
      'markdown': 'To bring in the newest data available, the whole sequence of loading, transforming and writing must be done repeatedly. Keboola Connection Orchestrator does exactly that – automatically.',
      'media': 'kbc_scheme_light_blue.svg',
      'mediaType': 'img'
    }, {
      'id': 2,
      'position': 'aside',
      'backdrop': false,
      'title': 'Create Orchestration',
      'link': 'orchestrations',
      'nextStepDispatchAction': {type: ORCHESTRATION_CREATE_SUCCESS},
      'isNavigationVisible': true,
      'markdown': 'Add your first Orchestration by clicking **+ Add Orchestration** and naming it',
      'media': '',
      'mediaType': ''
    }, {
      'id': 3,
      'position': 'aside',
      'backdrop': false,
      'title': 'Orchestration Overview',
      'isNavigationVisible': true,
      'markdown': 'We only need to specify what tasks should be executed, in which order and when. We can also set up notifications that will be sent to us if something needs your attention. Start by click on ***Configure Tasks***',
      'nextStepDispatchAction': {type: ORCHESTRATION_TASKS_EDIT_START},
      'media': '',
      'mediaType': ''
    }, {
      'id': 4,
      'position': 'aside',
      'backdrop': false,
      'title': 'Configure Task',
      'isNavigationVisible': true,
      'markdown': 'Lets compose new task in desired order from previous lessons. Start by clicking Add Task. Configure the task in this order:'
                + `
- Snowflake extractor
- Transformation
- Tableau Writer

`,
      'nextStepDispatchAction': {type: ORCHESTRATION_TASKS_SAVE_SUCCESS},
      'media': '',
      'mediaType': ''
    }, {
      'id': 5,
      'position': 'aside',
      'backdrop': false,
      'title': 'Automate Orchestration',
      'isNavigationVisible': true,
      'markdown': 'Then we choose how often, on what days and at what time we want the orchestration to run.',
      'media': '',
      'mediaType': ''
    }, {
      'id': 6,
      'position': 'aside',
      'backdrop': false,
      'title': 'Setting Notifications',
      'isNavigationVisible': true,
      'markdown': 'Finally, we enter our email address to receive error notifications. From data extraction to data writing, we have set up the full pipeline. Any change to our Snowflake database tables will be automatically reflected in our Tableau results. Learn more about Automation, or follow a hands-on tutorial on automation in our user documentation.',
      'media': '',
      'mediaType': ''
    },
    {
      'id': 7,
      'position': 'center',
      'backdrop': true,
      'title': 'Congratulations',
      'isNavigationVisible': false,
      'link': 'home',
      'markdown': 'Congratulations! Lesson finished.',
      'media': 'keboola-finished.svg',
      'mediaType': 'img'
    }
  ]
};

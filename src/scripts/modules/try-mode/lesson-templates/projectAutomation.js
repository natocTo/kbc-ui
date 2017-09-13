import OrchestrationsConstants from '../../orchestrations/Constants';

const {ORCHESTRATION_CREATE_SUCCESS, ORCHESTRATION_TASKS_EDIT_START, ORCHESTRATION_TASKS_SAVE_SUCCESS, ORCHESTRATION_LOAD_SUCCESS, ORCHESTRATION_FIELD_SAVE_SUCCESS} = OrchestrationsConstants.ActionTypes;

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
      'markdown': 'To bring in the newest data available, the whole sequence of loading, transforming and writing must be done repeatedly. Keboola Connection Orchestrator does exactly that – automatically. <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
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
      'markdown': 'Create your first Orchestration by clicking **+ New Orchestration** and naming it.',
      'media': '',
      'mediaType': ''
    }, {
      'id': 3,
      'position': 'aside',
      'backdrop': false,
      'title': 'Orchestration Overview',
      'isNavigationVisible': true,
      'markdown': 'We only to specify what tasks should be executed, in which order and when. We can also set up notifications that will be sent to us if something needs your attention. Start by click on **Configure Tasks**.',
      'nextStepDispatchAction': {type: ORCHESTRATION_TASKS_EDIT_START},
      'media': '',
      'mediaType': ''
    }, {
      'id': 4,
      'position': 'aside',
      'backdrop': false,
      'title': 'Configure Task',
      'isNavigationVisible': true,
      'markdown': 'Let`s compose new task in desired order from previous lessons. Start adding tasks by clicking on green button **+ New task**. Configure the task in following order:'
                + `
- Snowflake extractor
- Transformation
- Tableau Writer
<br>

Then **Save** the task.

`,
      'nextStepDispatchAction': {type: ORCHESTRATION_TASKS_SAVE_SUCCESS},
      'media': '',
      'mediaType': ''
    }, {
      'id': 5,
      'position': 'aside',
      'backdrop': false,
      'title': 'Schedule Orchestration',
      'isNavigationVisible': true,
      'markdown': 'Now let`s schedule our configured task. Select how often, which days and at what time we want the orchestration to run.' +
      `
- Click on **Edit schedule**
- Choose desired schedule for run your task. Notice the generated **Next Schedules**
- Click on **Save**
      
      `,
      'nextStepDispatchAction': {type: ORCHESTRATION_LOAD_SUCCESS},
      'matchLink': '/orchestrations/\\d+',
      'media': '',
      'mediaType': ''
    }, {
      'id': 6,
      'position': 'aside',
      'backdrop': false,
      'title': 'Configure Notifications',
      'isNavigationVisible': true,
      'markdown': 'Lat step is to enter email address to receive notifications about your scheduled tasks.' +
      `
- Click on **Configure Notifications**
- Click on **Edit Notifications**
- Add your email address for all of three inputs and click **+** button.
- Click on **Save**

`,
      'nextStepDispatchAction': {type: ORCHESTRATION_FIELD_SAVE_SUCCESS},
      'matchLink': '/orchestrations/\\d+',
      'media': '',
      'mediaType': ''
    }, {
      'id': 7,
      'position': 'center',
      'backdrop': true,
      'title': 'Conclusion',
      'isNavigationVisible': false,
      'markdown': 'That`s it! From data extraction to data writing, we have set up the full pipeline. Any change to our Snowflake database tables will be automatically reflected in our Tableau results. Learn more about <a href="https://help.keboola.com/overview/#full-automation" target="_blank">Automation</a>, or follow a hands-on tutorial on automation in our <a href="https://help.keboola.com/tutorial/automate/" target="_blank">user documentation</a>.',
      'media': '',
      'mediaType': ''
    },
    {
      'id': 8,
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

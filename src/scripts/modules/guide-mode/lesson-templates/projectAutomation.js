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
      'isNavigationVisible': false,
      'title': 'Introduction',
      'link': '/',
      'markdown': 'To bring in the newest data available, the whole sequence of loading, transforming and writing must be done repeatedly. Keboola Connection Orchestrator does exactly that – automatically. <br/><br/> In this lesson, you will specify at what time or how often the tasks you configured in the previous lessons should be executed, and in what order. In addition, you will set up notifications that will be sent to you in case something goes wrong and requires your attention. <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
      'media': 'kbc_scheme_light_blue.svg',
      'mediaType': 'img'
    }, {
      'id': 2,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Create Orchestration',
      'link': 'orchestrations',
      'nextStepDispatchAction': {type: ORCHESTRATION_CREATE_SUCCESS},
      'markdown': 'To create the orchestration of your tasks, click <span class="btn btn-success btn-xs">+ New Orchestration</span>. Then type in the orchestration’s name, e.g., *My orchestration*.',
      'media': '',
      'mediaType': ''
    }, {
      'id': 3,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Orchestration Overview',
      'markdown': 'The orchestrator configuration consists of three separate parts in which you will create the desired **sequence** of the tasks you wish to execute. You will set your execution **schedule**, and select **notifications** you want to be sent to you in case of errors, delays, etc. <br/><br/> Start by clicking on <span class="btn btn-success btn-xs">Configure Tasks</span> to select and order the tasks.',
      'nextStepDispatchAction': {type: ORCHESTRATION_TASKS_EDIT_START},
      'media': '',
      'mediaType': ''
    }, {
      'id': 4,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Configure Task',
      'markdown': 'As tasks, you will run the Snowflake extractor, transformation and Tableau writer configured in the previous lessons. Add the tasks one by one by clicking on the green button <span class="btn btn-success btn-xs">+ New Task</span>.'
                + `
- Step 1: After clicking <span class="btn btn-success btn-xs">+ New task</span>, select your Snowflake extractor.
- Step 2: Click <span class="btn btn-success btn-xs">+ New task</span> again. Then click on the little Back icon on the right, and select your transformation from the list.
- Step 3: Click <span class="btn btn-success btn-xs">+ New task</span>, then return to the list of your configurations one more time, and select your Tableau Writer.
<br>

Then click <span class="btn btn-success btn-xs">Save</span> in the upper right corner.

`,
      'nextStepDispatchAction': {type: ORCHESTRATION_TASKS_SAVE_SUCCESS},
      'media': '',
      'mediaType': ''
    }, {
      'id': 5,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Schedule Orchestration',
      'markdown': 'Now click on <span class="btn btn-success btn-xs">Edit schedule</span> to choose how often, on what days and at what time you want the configured tasks to run.' +
      `
- Choose whether you want to run the tasks every hour, every day, month, etc. Notice the generated <span class="btn btn-success btn-xs">Next Schedules</span> below, telling you when the next orchestrations will run in your local time.
- Click on <span class="btn btn-success btn-xs">Save</span>.
      
      `,
      'nextStepDispatchAction': {type: ORCHESTRATION_LOAD_SUCCESS},
      'matchLink': '/orchestrations/\\d+',
      'media': '',
      'mediaType': ''
    }, {
      'id': 6,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Configure Notifications',
      'markdown': 'Finally, to receive email notifications about errors, warnings and processing delays, enter the email address where you want notifications about your scheduled tasks to be sent.' +
      `
- Click on <span class="btn btn-success btn-xs">Configure Notifications</span>.
- Then click on <span class="btn btn-success btn-xs">Edit Notifications</span> in the upper right corner.
- Add your email address for all three notification types and click the <span class="btn btn-success btn-xs"> + </span> button. It moves the address to the subscriber field above. You can add as many recipients as you want.
- Click on <span class="btn btn-success btn-xs">Save</span>.

`,
      'nextStepDispatchAction': {type: ORCHESTRATION_FIELD_SAVE_SUCCESS},
      'matchLink': '/orchestrations/\\d+',
      'media': '',
      'mediaType': ''
    }, {
      'id': 7,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Conclusion',
      'markdown': 'And that`s it! From data extraction to data writing, you have set up the full pipeline. Any change to your Snowflake database tables will be automatically reflected in your Tableau results. <br/><br/> Learn more about <a href="https://help.keboola.com/orchestrator/" target="_blank">Automation</a>, or follow the hands-on tutorial on automation in our <a href="https://help.keboola.com/tutorial/automate/" target="_blank">user documentation</a>. <br/><br/> Remember that no matter what problems you encounter while working with Keboola Connection, we will be more than happy to help you via our **Support**. There is <a href="https://help.keboola.com/" target="_blank">user documentation</a> written for you as well, covering every component of Keboola Connection. <br/><br/> If you wish to disable the Guide Mode, go to **Users & Settings**, the tab **Settings**.',
      'media': '',
      'mediaType': ''
    },
    {
      'id': 8,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Congratulations',
      'link': '/',
      'markdown': 'Congratulations! You have completed all lessons.',
      'media': 'keboola-finished.svg',
      'mediaType': 'img'
    }
  ]
};
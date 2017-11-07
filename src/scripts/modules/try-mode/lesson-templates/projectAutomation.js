import OrchestrationsConstants from '../../orchestrations/Constants';

const {ORCHESTRATION_CREATE_SUCCESS, ORCHESTRATION_TASKS_EDIT_START, ORCHESTRATION_TASKS_SAVE_SUCCESS, ORCHESTRATION_LOAD_SUCCESS, ORCHESTRATION_FIELD_SAVE_SUCCESS} = OrchestrationsConstants.ActionTypes;

export default {
  'id': 5,
  'title': 'Project Automation',
  'steps': [
    {
      'id': 1,
      'position': 'center',
      'layout': 'content',
      'backdrop': true,
      'title': 'Introduction',
      'link': 'home',
      'markdown': 'To bring in the newest data available, the whole sequence of loading, transforming and writing must be done repeatedly. Keboola Connection Orchestrator does exactly that – automatically. <br/><br/> In this lesson, you will specify at what time or how often the tasks you configured in the previous lessons should be executed and in what order. In addition, you will set up notifications to receive in case something goes wrong and requires you attention. <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
      'media': 'kbc_scheme_light_blue.svg',
      'mediaType': 'img'
    }, {
      'id': 2,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Create Orchestration',
      'link': 'orchestrations',
      'nextStepDispatchAction': {type: ORCHESTRATION_CREATE_SUCCESS},
      'markdown': 'To create the orchestration of your tasks, click **+ New Orchestration**. Then type in the orchestration’s name, e.g., My orchestration.',
      'media': '',
      'mediaType': ''
    }, {
      'id': 3,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Orchestration Overview',
      'markdown': 'The orchestrator configuration process consists of three separate parts in which you will create the desired sequence of the tasks to be executed, set the desired schedule, and select error and warning notifications. <br/><br/>. Start by clicking on **Configure Tasks** to select and order the tasks.',
      'nextStepDispatchAction': {type: ORCHESTRATION_TASKS_EDIT_START},
      'media': '',
      'mediaType': ''
    }, {
      'id': 4,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Configure Task',
      'markdown': 'As tasks, you will run the Snowflake extractor, transformation and Tableau writer configured in the previous lessons. Add the tasks one by one by clicking on the green button **+ New task**.'
                + `
- Step 1: After clicking **+ New task**, select your Snowflake Extractor.
- Step 2: Click **+ New task** again. Then click on the little Back icon on the right and select you transformation from the list.
- Step 3: Click **+ New task**, then return to the list of your configurations one more time, and select your Tableau Writer.
<br>

Then click **Save** in the upper right corner.

`,
      'nextStepDispatchAction': {type: ORCHESTRATION_TASKS_SAVE_SUCCESS},
      'media': '',
      'mediaType': ''
    }, {
      'id': 5,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Schedule Orchestration',
      'markdown': 'Now click on **Edit schedule** to choose how often, on what days and at what time you want the configured tasks to run.' +
      `
- Choose whether you want to run the tasks every hour, every day, month, etc. Notice the generated **Next Schedules** below, telling you when the next orchestrations will run in your local time.
- Click on **Save**.
      
      `,
      'nextStepDispatchAction': {type: ORCHESTRATION_LOAD_SUCCESS},
      'matchLink': '/orchestrations/\\d+',
      'media': '',
      'mediaType': ''
    }, {
      'id': 6,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Configure Notifications',
      'markdown': 'Finally, to receive email notifications about errors, warnings and processing delays, enter the email address where you want notifications about your scheduled tasks to be sent.' +
      `
- Click on **Configure Notifications**.
- Click on **Edit Notifications** in the upper right corner.
- Add your email address for all three notification types and click **+** button. It moves the address to the subscriber field above. You can add as many recipients as you want.
- Click on **Save**.

`,
      'nextStepDispatchAction': {type: ORCHESTRATION_FIELD_SAVE_SUCCESS},
      'matchLink': '/orchestrations/\\d+',
      'media': '',
      'mediaType': ''
    }, {
      'id': 7,
      'position': 'center',
      'layout': 'content',
      'backdrop': true,
      'title': 'Conclusion',
      'markdown': 'That`s it! From data extraction to data writing, we have set up the full pipeline. Any change to our Snowflake database tables will be automatically reflected in our Tableau results. <br/><br/> Learn more about <a href="https://help.keboola.com/orchestrator/" target="_blank">Automation</a>, or follow a hands-on tutorial on automation in our <a href="https://help.keboola.com/tutorial/automate/" target="_blank">user documentation</a>.',
      'media': '',
      'mediaType': ''
    },
    {
      'id': 8,
      'position': 'center',
      'layout': 'congratulations',
      'backdrop': true,
      'title': 'Congratulations',
      'link': 'home',
      'markdown': 'Congratulations! All lessons are finished.',
      'media': 'keboola-finished.svg',
      'mediaType': 'img'
    }
  ]
};

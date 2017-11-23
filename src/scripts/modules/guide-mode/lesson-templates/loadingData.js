import ComponentsConstants from '../../components/Constants';
import JobsConstants from '../../jobs/Constants';

const {INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS} = ComponentsConstants.ActionTypes;
const {JOB_LOAD_SUCCESS} = JobsConstants.ActionTypes;

export default {
  'id': 2,
  'title': 'Loading Data',
  'steps': [
    {
      'id': 1,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Introduction',
      'link': 'app',
      'markdown': 'As promised in Lesson 1, you are about to build a simple workflow that analyzes data about car ownership stored in two database tables. <br/> In this lesson you will start by configuring an extractor to access the prepared tables in a sample database. You will then take the data in the tables and copy it into new tables created for this purpose in Keboola Connection Storage. <br/><br/> *Follow the instructions written for you in each step. Once you are done, you will be moved to the next step automatically. If hitting **Next step** is required though, you will be told to do so in the instructions.* <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
      'media': 'kbc_scheme_light_blue-ext.svg',
      'mediaType': 'img'
    }, {
      'id': 2,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Create Extractor',
      'link': 'extractors',
      'nextStepDispatchAction': {type: COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'},
      'markdown': 'Because both data tables are stored in a Snowflake database, you’ll be using the Snowflake extractor. By configuring it, you’ll specify what data to bring from the external database to your project and how.'
                + `
- Find **Snowflake**. You can use the search feature to find it quickly.
- Click on <span class="btn btn-success btn-xs">More</span> and continue with <span class="btn btn-success btn-xs">+ New Configuration</span>.
- Name the configuration, e.g., *My database extractor*, and click on <span class="btn btn-success btn-xs">Create Configuration</span>.

`,
      'media': '',
      'mediaType': ''
    }, {
      'id': 3,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Setup Connection',
      'markdown': 'To access the source database where the data about cars and population is stored, provide a password and other credentials.'
                + `
- Click on <span class="btn btn-success btn-xs">Setup Database Credentials</span>.
- Set Host to \`kebooladev.snowflakecomputing.com\`
- Set Port to \`443\`
- Set Username, Password, Database and Schema to \`HELP_TUTORIAL\`
- Set Warehouse to \`DEV\`
- You can test the credentials. Make sure to save them by clicking on <span class="btn btn-success btn-xs">Save</span> in the upper right corner.
`,
      'nextStepDispatchAction': {type: INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'},
      'media': '',
      'mediaType': ''
    }, {
      'id': 4,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Select Tables',
      'markdown':
      'Once you have access to the database, it’s time to actually extract the data about the number of cars in different countries.'
      + `
- Select the tables CARS and POPULATION from the drop-down list on the left.
- Click <span class="btn btn-success btn-xs">Create</span>. Your extractor will be automatically configured.

`,
      'media': '',
      'mediaType': '',
      'nextStepDispatchAction': {type: INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'}
    },

    {
      'id': 5,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Run Extraction',
      'markdown': 'In the summary on the left, you can see what tables will be created in Storage once the extraction runs. They do not exist yet. <br/><br/> To run the extraction and create the tables, click <span class="btn btn-link btn-xs"> <i class="fa fa-play"></i> Run Extraction</span> on the right. The data from your selected external database tables will be loaded into the new tables in your project. <br/><br/> Be patient. It takes a while to finish.',
      'media': '',
      'mediaType': '',
      'nextStepDispatchAction': {type: JOB_LOAD_SUCCESS}
    }, {
      'id': 6,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Check Storage',
      'link': 'storage',
      'markdown': 'If you open your **Storage** and click the bucket **in.c-keboola-ex-db-snowflake**, you can see that both tables have been successfully extracted from the Snowflake database and loaded into Keboola Connection. Feel free to click on the table names to see more details, including a data sample. ',
      'media': '',
      'mediaType': ''
    }, {
      'id': 7,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': true,
      'title': 'Lesson 2 Finished',
      'link': '/',
      'markdown': 'To find out how you can work with the loaded data, continue to **Lesson 3 – Manipulating Data**. <br/><br/> Learn more about <a href="https://help.keboola.com/overview/#extractors" target="_blank">Extractors</a>, or follow the hands-on tutorial on loading in our <a href="https://help.keboola.com/tutorial/load" target="_blank">user documentation</a>.',
      'media': '',
      'mediaType': ''
    }

  ]
};

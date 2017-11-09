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
      'layout': 'content',
      'backdrop': true,
      'title': 'Introduction',
      'link': 'home',
      'markdown': 'As promised in Lesson 1, you are about to build a simple workflow that analyzes data about car ownership stored in two database tables. <br/><br/> In this lesson you will start by configuring an extractor to access the prepared tables in a sample database. You will then take the data in the tables and copy it into new tables created for this purpose in Keboola Connection Storage. <br/><br/> Follow the instructions written for you in each step. Once you are done, you will be moved to the next step automatically. If hitting **Next step** is required though, you will be told to do so in the instructions. <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
      'media': 'kbc_scheme_light_blue-ext.svg',
      'mediaType': 'img'
    }, {
      'id': 2,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Create Extractor',
      'link': 'extractors',
      'nextStepDispatchAction': {type: COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'},
      'markdown': 'Because the two data tables are stored in a Snowflake database, you’ll be using the Snowflake extractor. By configuring it, you’ll specify what data to bring from the external database to your project and how.'
                + `
- Click on <span class="btn btn-success btn-xs">+ New Extractor</span> in the upper right corner.
- Find **Snowflake**. You can use the search feature to find it quickly.
- Click on <span class="btn btn-success btn-xs">More</span> and continue with <span class="btn btn-success btn-xs">+ New Configuration</span>.
- Name the configuration, e.g., *My database extractor*, and click on <span class="btn btn-success btn-xs">Create Configuration</span>.

`,
      'media': '',
      'mediaType': ''
    }, {
      'id': 3,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Setup Connection',
      'markdown': 'Now you will configure the new extractor. First you need to provide a password and other credentials to access the source database where the data is stored.'
                + `
- Click on <span class="btn btn-success btn-xs">Setup Database Credentials</span> on the right.
- Set Host to \`kebooladev.snowflakecomputing.com\`.
- Set Port to \`443\`.
- Set Username, Password, Database and Schema to \`HELP_TUTORIAL\`.
- Set Warehouse to \`DEV\`.
- Save the credentials by clicking on <span class="btn btn-success btn-xs">Save</span> in the upper right corner.
`,
      'nextStepDispatchAction': {type: INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'},
      'media': '',
      'mediaType': ''
    }, {
      'id': 4,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Create SQL Query',
      'markdown':
      'Now it’s time to actually extract the data. You need to write two SQL queries, one for each table. Every database query needs to have a name, an SQL command specifying what to extract from the database, and a new **output table** where the data will be written in **Storage**. <br/><br/> Start by creating the first query for extracting data about cars.'
      + `
- Click on <span class="btn btn-success btn-xs">+ New Query</span>.
- Name the query \`cars\`.
- Set the **Output table** to \`in.c-tutorial.cars\`.
- Paste this simple query below: \`SELECT * FROM cars;\` 
- Click on <span class="btn btn-success btn-xs">Create Query</span>.

`,
      'media': '',
      'mediaType': '',
      'nextStepDispatchAction': {type: INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'}
    },
    {
      'id': 5,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Create Second SQL Query',
      'markdown':
      'Similarly, create a query to extract info about population.'
      + `
- Click on <span class="btn btn-success btn-xs">+ New Query</span>.
- Name the query \`population\`.
- Set **Output table** to \`in.c-tutorial.population\`.
- Paste this simple query below: \`SELECT * FROM population;\` 
- Click on <span class="btn btn-success btn-xs">Create Query</span>.

`,
      'media': '',
      'mediaType': '',
      'nextStepDispatchAction': {type: INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'}
    },

    {
      'id': 6,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Run Extraction',
      'markdown': 'Now click on <span class="btn btn-link btn-xs"> <i class="fa fa-play"></i> Run Extraction</span> to load the data from the two external database tables into the new tables in your project. You will find them in **Storage**.',
      'media': '',
      'mediaType': '',
      'nextStepDispatchAction': {type: JOB_LOAD_SUCCESS}
    }, {
      'id': 7,
      'position': 'center',
      'layout': 'content',
      'backdrop': false,
      'title': 'Stored Extraction',
      'link': 'storage',
      'markdown': 'If you open your **Storage**, you can see that both tables have been successfully extracted from the Snowflake database and loaded into Keboola Connection. ' +
      '<br/><br/> To find out how you can work with the loaded data, continue to **Lesson 3 – Manipulating Data**. <br/><br/> Learn more about <a href="https://help.keboola.com/overview/#extractors" target="_blank">Extractors</a>, or follow a hands-on tutorial on loading in our <a href="https://help.keboola.com/tutorial/load" target="_blank">user documentation</a>.',
      'media': '',
      'mediaType': ''
    }
  ]
};

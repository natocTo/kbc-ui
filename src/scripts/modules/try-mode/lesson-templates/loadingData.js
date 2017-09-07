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
      'title': 'Introduction',
      'link': 'home',
      'isNavigationVisible': true,
      'markdown': 'As promised in Lesson 1, we are going to build a simple workflow analyzing data about car ownership stored two database tables. In this lesson, we will configure an Extractor that will access the prepared tables in a sample database. We will take the data in the tables and copy it into new tables created for this purpose in Keboola Connection Storage. <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
      'media': 'kbc_scheme_light_blue-ext.svg',
      'mediaType': 'img'
    }, {
      'id': 2,
      'position': 'aside',
      'backdrop': false,
      'title': 'Create Extractor',
      'link': 'extractors',
      'nextStepDispatchAction': {type: COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'},
      'isNavigationVisible': true,
      'markdown': 'Because the two data tables are stored in a Snowflake database, we’ll be using the Snowflake extractor. By configuring it, we’ll specify what data to extract and how.'
                + `

### TO DO:

- Click on **+ New Extractor**
- Find **Snowflake**. You can use the search feature to find it quickly.
- Click on **More** and continue with **+ New Configuration**
- Name the configuration and click on **Create Configuration**

`,
      'media': '',
      'mediaType': ''
    }, {
      'id': 3,
      'position': 'aside',
      'backdrop': false,
      'title': 'Setup Connection',
      'isNavigationVisible': true,
      'markdown': 'After naming our new configuration of the extractor let’s configure it. Start by setting up the database connection.'
                + `

### TO DO:

- Click on **Setup Database Credentials**
- Host to \`kebooladev.snowflakecomputing.com\`
- Port to \`443\`
- Username, Password, Database and Schema to \`HELP_TUTORIAL\`
- Warehouse to \`DEV\`
- Click on **Save**
`,
      'nextStepDispatchAction': {type: INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'},
      'media': '',
      'mediaType': ''
    }, {
      'id': 4,
      'position': 'aside',
      'backdrop': false,
      'title': 'Create SQL Query',
      'isNavigationVisible': true,
      'markdown':
      'Each database query needs to have a name and an SQL command. The new **output table** that will be created in **Storage** has to be named here too. Let’s create the first query for extracting data about cars and save it.'
      + `

### TO DO:

- Click on **+ New Query**
- Name the query as you wish
- Set **Output table** \`in.c-tutorial.cars\`
- Paste simple query \`SELECT * FROM cars;\`
- Click on **Create Query**
`,
      'media': '',
      'mediaType': '',
      'nextStepDispatchAction': {type: INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'}
    }, {
      'id': 5,
      'position': 'aside',
      'backdrop': false,
      'title': 'Run Extracion',
      'isNavigationVisible': true,
      'markdown': 'Now let’s click on **Run Extraction** to load the data from the two database tables into the new tables in **Storage**.',
      'media': '',
      'mediaType': '',
      'nextStepDispatchAction': {type: JOB_LOAD_SUCCESS}
    }, {
      'id': 6,
      'position': 'aside',
      'backdrop': false,
      'title': 'Stored Extraction',
      'link': '/storage',
      'isNavigationVisible': true,
      'markdown': '**Storage** let you see that both tables have been successfully extracted from the Snowflake database and loaded into Keboola Connection. ' +
      'To find out how you can work with the loaded data, continue to **Lesson 3 – Manipulating Data**. Learn more about <a href="https://help.keboola.com/overview/#extractors" target="_blank">Extractors</a>, or follow a hands-on tutorial on loading in our <a href="https://help.keboola.com/tutorial/load" target="_blank">user documentation</a>.<br>Click on **Next step**.',
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

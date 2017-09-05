import ComponentsConstants from '../components/Constants';
import TransformationsConstants from '../transformations/Constants';
import JobsConstants from '../jobs/Constants';
import OrchestrationsConstants from '../orchestrations/Constants';
// import kbcConstants from '../../constants/KbcConstants';
const {INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS} = ComponentsConstants.ActionTypes;
const {TRANSFORMATION_BUCKET_CREATE_SUCCESS, TRANSFORMATION_CREATE_SUCCESS} = TransformationsConstants.ActionTypes;
const {JOB_LOAD_SUCCESS} = JobsConstants.ActionTypes;
const {ORCHESTRATION_CREATE_SUCCESS, ORCHESTRATION_TASKS_EDIT_START, ORCHESTRATION_TASKS_SAVE_SUCCESS} = OrchestrationsConstants.ActionTypes;

export default {
  '1': {
    'id': 1,
    'title': 'Basic Overview',
    'steps': [
      {
        'id': 1,
        'position': 'center',
        'backdrop': true,
        'title': 'Introduction',
        'link': 'home',
        'isNavigationVisible': true,
        'markdown': 'As a powerful and safe environment for working with data, Keboola Connection consists of many interconnected components. It helps you extract data from various sources, manipulate and enrich the data, write the results to visualizing tools of your choice, etc. In addition, the whole process can be fully automated.',
        'media': 'kbc_scheme_light_blue.svg',
        'mediaType': 'img'
      },
      {
        'id': 2,
        'position': 'aside',
        'backdrop': false,
        'title': 'Extract data',
        'link': 'extractors',
        'isNavigationVisible': true,
        'markdown': 'Every project in Keboola Connection starts with loading data. It is done with **Extractors** – components for importing data from your own computer, your company’s internal databases, and external sources, such as Facebook or YouTube.',
        'media': 'https://www.youtube.com/embed/g-VBfkV4xfc',
        'mediaType': 'video'
      },
      {
        'id': 3,
        'position': 'aside',
        'backdrop': false,
        'title': 'Store data',
        'link': '/storage',
        'isNavigationVisible': true,
        'markdown': 'All data you upload to your project, as well as all the tables your project creates, are stored in **Storage** where they can be accessed at any time. To make it easier for you to find what you’re looking for, the data tables are organized into buckets.',
        'media': 'kbc_scheme_light_blue.svg',
        'mediaType': 'img'
      },
      {
        'id': 4,
        'position': 'aside',
        'backdrop': false,
        'title': 'Manipulate data',
        'link': 'transformations',
        'isNavigationVisible': true,
        'markdown': 'Now it’s time to mix, clean and work with the extracted data. In **Transformations**, use your own script (SQL, Python, R or OpenRefine) for manipulation with the data. Or, select ready-to-use Applications created by Keboola or third parties.',
        'media': '',
        'mediaType': ''

      },
      {
        'id': 5,
        'position': 'aside',
        'backdrop': false,
        'title': 'Write results',
        'link': 'writers',
        'isNavigationVisible': true,
        'markdown': 'Once you’re happy with your results, let **Writers** deliver them to their final destination –  the systems and applications where the output data gets used or consumed, for instance, visualizing tools or databases.',
        'media': '',
        'mediaType': ''
      },
      {
        'id': 6,
        'position': 'aside',
        'backdrop': false,
        'title': 'Automate',
        'link': 'orchestrations',
        'isNavigationVisible': true,
        'markdown': 'If you want to work with the latest data available, the whole sequence must be done over and over again. This is where full automation of your projects comes in. **Orchestrations** allow you to specify at what time or how often your tasks should be executed and in what order.',
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
  },
  '2': {
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
        'markdown': 'As promised in Lesson 1, we are going to build a simple workflow analyzing data about car ownership stored two database tables. In this lesson, we will configure an Extractor that will access the prepared tables in a sample database. We will take the data in the tables and copy it into new tables created for this purpose in Keboola Connection Storage. Note: Your own projects won’t be affected by this in any way.',
        'media': 'kbc_scheme_light_blue.svg',
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
        'markdown': 'After naming our new configuration of the extractor let’s configure it. Start by setting up the database connection'
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

- Click on **+ Add Query**
- name the query as you wish
- set output table \`in.c-tutorial.cars\`
- paste simple query \`SELECT * FROM cars;\` 
- click on **Save**
`,
        'media': '',
        'mediaType': ''
      }, {
        'id': 5,
        'position': 'aside',
        'backdrop': false,
        'title': 'Run Extracion',
        'isNavigationVisible': true,
        'markdown': 'Now let’s click on **Run Extraction** to load the data from the two database tables into the new tables in Storage. Once you understand what is happening, click on Next step',
        'media': '',
        'mediaType': ''
      }, {
        'id': 6,
        'position': 'aside',
        'backdrop': false,
        'title': 'Stored Extraction',
        'link': '/storage',
        'isNavigationVisible': true,
        'markdown': 'In Storage, you can see that both tables have been successfully extracted from the Snowflake database and loaded into Keboola Connection. To find out how you can work with the loaded data, continue to Lesson 3 – Manipulating Data. Learn more about [Extractors](https://help.keboola.com/overview/#extractors){:target="_blank"}, or follow a hands-on tutorial on loading in our [user documentation](https://help.keboola.com/tutorial/load){:target="_blank"}. ',
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
  },
  '3': {
    'id': 3,
    'title': 'Manipulating Data',
    'steps': [
      {
        'id': 1,
        'position': 'center',
        'backdrop': true,
        'title': 'Introduction',
        'link': 'home',
        'isNavigationVisible': true,
        'markdown': 'In this lesson, we are going to process the data we loaded into Storage in Lesson 2. Using a simple Transformation, we will merge the tables (Cars and Population) and compute the ratio of motor vehicles to persons per country.',
        'media': 'kbc_scheme_light_blue.svg',
        'mediaType': 'img'
      }, {
        'id': 2,
        'position': 'aside',
        'backdrop': false,
        'title': 'Create Bucket',
        'link': 'transformations',
        'isNavigationVisible': true,
        'markdown': 'Before creating our transformation, we need to add a new bucket for it in the section Transformations. ',
        'nextStepDispatchAction': {type: TRANSFORMATION_BUCKET_CREATE_SUCCESS},
        'media': '',
        'mediaType': ''
      }, {
        'id': 3,
        'position': 'aside',
        'backdrop': false,
        'title': 'Create Transformation',
        'link': '',
        'isNavigationVisible': true,
        'markdown': 'After naming our new configuration of the extractor and providing credentials to access the source database where the data is stored, it’s time to actually extract the data. It’s done using SQL queries. To extract our two tables, we need to write two queries, one for each table.',
        'nextStepDispatchAction': {type: TRANSFORMATION_CREATE_SUCCESS},
        'media': '',
        'mediaType': ''
      }, {
        'id': 4,
        'position': 'aside',
        'backdrop': false,
        'title': 'Set Mappings',
        'link': '',
        'isNavigationVisible': true,
        'markdown':
        'Each database query needs to have a name and an SQL command. The new output table that will be created in Storage has to be named here too. Let’s create the first query for extracting data about cars and save it.'

        + `
        
### TO DO:

- Click on **+ Add Input** and select in.c-tutorial.cars
- Click on **+ Add Output** Destination out.c-snowflake.transformed
- Add Query \`CREATE TABLE transformed AS
SELECT \`cars\`.*, \`population\`.\`POPULATION\`, (\`population\`.\`POPULATION\` / \`cars\`.\`CARS\`) AS \`PERSON_PER_CAR\`
FROM \`cars\` JOIN \`population\`
On \`cars\`.\`COUNTRY\` = \`population\`.\`COUNTRY\`;\` 
- Click on **Next Step**

`,
        'media': '',
        'mediaType': ''
      }, {
        'id': 5,
        'position': 'aside',
        'backdrop': false,
        'title': 'Run Transformation',
        'link': '',
        'isNavigationVisible': true,
        'markdown': 'Similarly, we create a query to extract info about population.',
        'nextStepDispatchAction': {type: JOB_LOAD_SUCCESS},
        'media': '',
        'mediaType': ''
      }, {
        'id': 6,
        'position': 'aside',
        'backdrop': false,
        'title': 'Check Job',
        'link': 'jobs',
        'isNavigationVisible': true,
        'markdown': 'Now let’s click on Run Extraction to load the data from the two database tables into the new tables in Storage.',
        'media': '',
        'mediaType': ''
      }, {
        'id': 7,
        'position': 'aside',
        'backdrop': false,
        'title': 'Check Storage',
        'link': 'home',
        'isNavigationVisible': true,
        'markdown': 'In Storage, you can see that both tables have been successfully extracted from the Snowflake database and loaded into Keboola Connection. To find out how you can work with the loaded data, continue to Lesson 3 – Manipulating Data. Learn more about Extractors, or follow a hands-on tutorial on loading in our user documentation. ',
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
  },
  '4': {
    'id': 4,
    'title': 'Visualizing Results',
    'steps': [
      {
        'id': 1,
        'position': 'center',
        'backdrop': true,
        'title': 'Introduction',
        'link': 'home',
        'isNavigationVisible': true,
        'markdown': 'Transformation results can be delivered to any analytics or business intelligence tool. In this lesson, we are going to generate a Tableau Data Extract and load it manually into Tableau Desktop for visualization using yet another Keboola Connection component – a Writer.',
        'media': 'kbc_scheme_light_blue.svg',
        'mediaType': 'img'
      },
      {
        'id': 2,
        'position': 'aside',
        'backdrop': false,
        'title': 'Create Writer',
        'link': 'writers',
        'nextStepDispatchAction': {type: COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS, componentId: 'tde-exporter'},
        'isNavigationVisible': true,
        'media': '',
        'markdown': 'Let’s say we have Tableau Desktop installed. Now we need to find the Tableau writer in the Writers section.'
        + `
### TO DO:
- Click on **+ New Writer**
- Find **Tableau**. You can use the search feature to find it quickly.
- Click on **More** and continue with **+ New Configuration**
- Name the configuration and click on **Create Configuration**

`,
        'mediaType': ''
      },
      {
        'id': 3,
        'position': 'aside',
        'backdrop': false,
        'title': 'Add Table',
        'nextStepDispatchAction': {type: JOB_LOAD_SUCCESS},
        'markdown':
        'Then let’s add the table we want to send to Tableau. For each of its columns we also need to specify whether it contains text or a number.'
        + `
        
### TO DO:

- Click on **+ Add Table**
- Find **Tableau**. You can use the search feature to find it quickly.
- Select  'in.c-tutrial.cars'
- Select proper 'TDE Data Type' and Save this table
- click Export

`,
        'isNavigationVisible': true
      },

      {
        'id': 4,
        'position': 'center',
        'backdrop': true,
        'title': 'Run Extracion',
        'isNavigationVisible': false,
        'markdown': 'The final step is to open the downloaded file in Tableau and create any reports we want. To see how to automate the whole process, continue to the next lesson - Project Automation. Learn more about Automation, or follow a hands-on tutorial on automation in our user documentation.',
        'media': 'tbl.png',
        'mediaType': 'img'
      },
      {
        'id': 5,
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
  },
  '5': {
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
  }
};

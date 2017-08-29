import ComponentsConstants from '../components/Constants';
// import kbcConstants from '../../constants/KbcConstants';
const {INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS} = ComponentsConstants.ActionTypes;

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
        'text': 'As a powerful and safe environment for working with data, Keboola Connection consists of many interconnected components. It helps you extract data from various sources, manipulate and enrich the data, write the results to visualizing tools of your choice, etc. In addition, the whole process can be fully automated.',
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
        'text': 'Every project in Keboola Connection starts with loading data. It is done with Extractors – components for importing data from your own computer, your company’s internal databases, and external sources, such as Facebook or YouTube.',
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
        'text': 'All data you upload to your project, as well as all the tables your project creates, are stored in Storage where they can be accessed at any time. To make it easier for you to find what you’re looking for, the data tables are organized into buckets.',
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
        'text': 'Now it’s time to mix, clean and work with the extracted data. In Transformations, use your own script (SQL, Python, R or OpenRefine) for manipulation with the data. Or, select ready-to-use Applications created by Keboola or third parties.',
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
        'text': 'Once you’re happy with your results, let Writers deliver them to their final destination –  the systems and applications where the output data gets used or consumed, for instance, visualizing tools or databases.',
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
        'text': 'If you want to work with the latest data available, the whole sequence must be done over and over again. This is where full automation of your projects comes in. Orchestrations allow you to specify at what time or how often your tasks should be executed and in what order.',
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
        'text': 'Congratulations, lesson finished.',
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
        'title': 'Lesson 2 - Composition',
        'link': 'home',
        'isNavigationVisible': true,
        'text': 'As promised in Lesson 1, we are going to build a simple workflow analyzing data about car ownership stored two database tables. In this lesson, we will configure an Extractor that will access the prepared tables in a sample database. We will take the data in the tables and copy it into new tables created for this purpose in Keboola Connection Storage. Note: Your own projects won’t be affected by this in any way.',
        'media': 'kbc_scheme_light_blue.svg',
        'mediaType': 'img'
      }, {
        'id': 2,
        'position': 'aside',
        'backdrop': false,
        'title': 'Lesson 2 - Create Database Extractor',
        'link': 'extractors',
        'nextStepDispatchAction': {type: COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'},
        'isNavigationVisible': true,
        'text': 'Because the two data tables are stored in a Snowflake database, we’ll be using the Snowflake extractor. By configuring it, we’ll specify what data to extract and how.',
        'markdown': `
### Create Snowflake Extractor Configuration

- Clink on **+ New Extractor**
- Find **Snowflake**. You can use the search feature to find it quickly.
- Click on **More** and continue with **Create New Configuration**
- Name the configuration and click on **Create**

`,
        'media': '',
        'mediaType': ''
      }, {
        'id': 3,
        'position': 'aside',
        'backdrop': false,
        'title': 'Lesson 2 - Setup Database Connection',
        'isNavigationVisible': true,
        'text': 'After naming our new configuration of the extractor let’s configure it. Start by setting up the database connection',
        markdown: `
Click on **Setup Database Credentials** and set
- Host to \`kebooladev.snowflakecomputing.com\`
- Port to \`443\`
- Username, Password, Database and Schema to \`HELP_TUTORIAL\`
- Warehouse to \`DEV\`

Click on **Save** and return back to the configuration index page.
`,
        nextStepDispatchAction: {type: INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'},
        'media': '',
        'mediaType': ''
      }, {
        'id': 4,
        'position': 'aside',
        'backdrop': false,
        'title': 'Lesson 2 - Create SQL Query',
        'isNavigationVisible': true,
        markdown: `
Each database query needs to have a **name** and an **SQL command**. The new **output table** that will be created in Storage has to be named here too. Let’s create the first query for extracting data about cars and save it.

Start by clicking on **+ Add Query** then create and save the following query:
- \`SELECT * FROM cars;\` with output table \`in.c-tutorial.cars\``,
        nextStepDispatchAction: {type: INSTALLED_COMPONENTS_CONFIGDATA_SAVE_SUCCESS, componentId: 'keboola.ex-db-snowflake'},
        'media': '',
        'mediaType': ''
      }, {
        'id': 5,
        'position': 'aside',
        'backdrop': false,
        'title': 'Lesson 2 - Run Extracion',
        'isNavigationVisible': false,
        'text': 'Now let’s click on Run Extraction to load the data from the two database tables into the new tables in Storage.',
        'media': '',
        'mediaType': ''
      }, {
        'id': 6,
        'position': 'center',
        'backdrop': true,
        'title': 'Lesson 2 - Composition',
        'link': 'home',
        'isNavigationVisible': true,
        'text': 'In Storage, you can see that both tables have been successfully extracted from the Snowflake database and loaded into Keboola Connection. To find out how you can work with the loaded data, continue to Lesson 3 – Manipulating Data. Learn more about Extractors, or follow a hands-on tutorial on loading in our user documentation. ',
        'media': '',
        'mediaType': ''
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
        'text': 'In this lesson, we are going to process the data we loaded into Storage in Lesson 2. Using a simple Transformation, we will merge the tables (Cars and Population) and compute the ratio of motor vehicles to persons per country.',
        'media': 'kbc_scheme_light_blue.svg',
        'mediaType': 'img'
      }, {
        'id': 2,
        'position': 'aside',
        'backdrop': false,
        'title': 'Step 1',
        'link': 'transformations',
        'isNavigationVisible': true,
        'text': 'Before creating our transformation, we need to add a new bucket for it in the section Transformations. ',
        'media': '',
        'mediaType': '',
        'floatNext': {
          'x': 560,
          'y': 340
        }
      }, {
        'id': 3,
        'position': 'aside',
        'backdrop': false,
        'title': 'Step 2',
        'link': 'extractors/keboola.ex-db-snowflake/282225922',
        'isNavigationVisible': true,
        'text': 'After naming our new configuration of the extractor and providing credentials to access the source database where the data is stored, it’s time to actually extract the data. It’s done using SQL queries. To extract our two tables, we need to write two queries, one for each table.',
        'media': '',
        'mediaType': ''
      }, {
        'id': 4,
        'position': 'aside',
        'backdrop': false,
        'title': 'Lesson 2 - Composition',
        'link': 'extractors/keboola.ex-db-snowflake/282225922/new-query',
        'isNavigationVisible': true,
        'text': 'Each database query needs to have a name and an SQL command. The new output table that will be created in Storage has to be named here too. Let’s create the first query for extracting data about cars and save it.',
        'media': '',
        'mediaType': ''
      }, {
        'id': 5,
        'position': 'aside',
        'backdrop': false,
        'title': 'Lesson 2 - Composition',
        'link': 'home',
        'isNavigationVisible': true,
        'text': 'Similarly, we create a query to extract info about population.',
        'media': '',
        'mediaType': ''
      }, {
        'id': 6,
        'position': 'aside',
        'backdrop': false,
        'title': 'Lesson 2 - Composition',
        'link': 'home',
        'isNavigationVisible': false,
        'text': 'Now let’s click on Run Extraction to load the data from the two database tables into the new tables in Storage.',
        'media': '',
        'mediaType': ''
      }, {
        'id': 7,
        'position': 'center',
        'backdrop': true,
        'title': 'Lesson 2 - Composition',
        'link': 'home',
        'isNavigationVisible': true,
        'text': 'In Storage, you can see that both tables have been successfully extracted from the Snowflake database and loaded into Keboola Connection. To find out how you can work with the loaded data, continue to Lesson 3 – Manipulating Data. Learn more about Extractors, or follow a hands-on tutorial on loading in our user documentation. ',
        'media': '',
        'mediaType': ''
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
        'text': 'žije umístěním k kyčle v spustit potenc indie. Testují zvenčí zvýšil s pomoc vloni ',
        'media': 'http://keboola.asia/wp-content/uploads/2015/05/scema1-1024x724.png',
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
        'text': 'žije umístěním k kyčle v spustit potenc indie. Testují zvenčí zvýšil s pomoc vloni ',
        'media': 'http://keboola.asia/wp-content/uploads/2015/05/scema1-1024x724.png',
        'mediaType': 'img'
      }
    ]
  }
};

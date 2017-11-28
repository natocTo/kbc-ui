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
      'markdown': 'As promised in Lesson 1, you are about to build a simple workflow that analyzes data about **car ownership** stored in two database tables. In this lesson you will start by configuring an extractor to access the prepared tables in a sample database. You will then take the data in the tables and copy it into new tables created for this purpose in Keboola Connection Storage. <br/><br/> *Follow the instructions written for you in each step. Once you are done, you will be moved to the next step automatically. If hitting <span class="btn btn-success btn-xs">Next step</span> is required though, you will be told to do so in the instructions.* <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
      'media': 'kbc_scheme_light_blue-ext.svg',
      'mediaType': 'img'
    }, {
      'id': 2,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Create Extractor',
      'link': 'extractors',
      'markdown': 'Because both data tables are stored in a Snowflake database, you’ll be using the Snowflake extractor. By configuring it, you’ll specify what data to bring from the external database to your project and how.'
                + `
- Find **Snowflake**. You can use the search feature to find it quickly.
- Click on <span class="btn btn-success btn-sm">More</span> and continue with <span class="btn btn-success btn-sm">+ New Configuration</span>.
- Name the configuration, e.g., *My database extractor*, and click on <span class="btn btn-success btn-sm">Create Configuration</span>.

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
- Click on <span class="btn btn-success btn-sm">Setup Database Credentials</span>.
- Set Host Name to \`kebooladev.snowflakecomputing.com\`
- Set Port to \`443\`
- Set Username, Password, Database and Schema to \`HELP_TUTORIAL\`
- Set Warehouse to \`DEV\`
- You can test the credentials. Make sure to save them by clicking on <span class="btn btn-success btn-sm">Save</span> in the upper right corner.
`,
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
- Click <span class="btn btn-success btn-sm">Create</span>. Your extractor will be automatically configured.

`,
      'media': '',
      'mediaType': ''
    },

    {
      'id': 5,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Run Extraction',
      'markdown': 'In the summary on the left, you can see what tables will be created in Storage once the extraction runs. They do not exist yet. <br/><br/> To create the new tables in your project, click <span class="btn btn-link btn-sm"> <i class="fa fa-play"></i> Run Extraction</span> on the right and wait. After the orange indicator turns green, the extraction is finished. <br/><br/> Hover above the output table names to see that they are no longer empty. You can also click on them to see more details. <br/><br/> To continue, click **Next step**.',
      'media': '',
      'link': 'extractors',
      'mediaType': ''
    }, {
      'id': 6,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Check Storage',
      'link': 'storage',
      'markdown': 'Another way of learning more about the newly created tables is to click the bucket **in.c-keboola-ex-db-snowflake** in your **Storage**. You can see that both tables have been successfully extracted from the Snowflake database and loaded into Keboola Connection. For more information about the tables, click their names.',
      'media': '',
      'mediaType': ''
    }, {
      'id': 7,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Learn More',
      'link': '',
      'markdown': 'In this lesson you have extracted data from two tables in an external database and imported the data to your project in Keboola Connection. To find out how you can work with the loaded data, continue to **Lesson 3 – Manipulating Data**. <br/><br/> Learn more about <a href="https://help.keboola.com/overview/#extractors" target="_blank">Extractors</a>, or follow the hands-on tutorial on loading in our <a href="https://help.keboola.com/tutorial/load" target="_blank">user documentation</a>.',
    }

  ]
};

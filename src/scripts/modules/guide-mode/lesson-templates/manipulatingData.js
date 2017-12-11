export default {
  'id': 3,
  'title': 'Manipulating Data',
  'steps': [
    {
      'id': 1,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Introduction',
      'markdown': 'In this lesson, you will process the data you loaded into Storage in Lesson 2. <br/><br/> Using a simple transformation, you will join the tables (*CARS* and *POPULATION*) and compute the ratio of motor vehicles to persons per country. The result will be also kept in Storage.',
      'media': 'kbc_scheme_light_blue-tra.svg',
      'mediaType': 'img',
      'route': {
        'name': 'app',
        'params': []
      }
    }, {
      'id': 2,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Create Bucket',
      'markdown': 'Like tables in Storage, Transformations are organized into buckets. Before creating your transformation, you need to create a new bucket. <br/><br/> Click on <span class="btn btn-success btn-sm">+ New Transformation Bucket</span> and name it, e.g., My transformation bucket. Then click <span class="btn btn-success btn-sm">Create Bucket</span>.',
      'media': '',
      'mediaType': '',
      'route': {
        'name': 'transformations',
        'params': []
      }
    }, {
      'id': 3,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Create Transformation',
      'markdown': 'Now add a new transformation into the new bucket:'
      + `
- Click <span class="btn btn-success btn-sm">+ New Transformation</span>.
- Name the transformation, e.g., My transformation.
- Select Snowflake as the backend &ndash; the engine running the transformation script.
- Then click <span class="btn btn-success btn-sm">Create Transformation</span>.

`,
      'media': '',
      'mediaType': '',
      'route': {
        'name': 'transformationBucket',
        'params': [
          'config'
        ]
      }
    }, {
      'id': 4,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Map Data & Set Queries',
      'markdown':
      'Next you need to specify what tables will be used in the transformation, what tables will be written to Storage as results, and what will happen with the data in the transformation:'
      + `<br><br>
**Input Mapping** — click <span class="btn btn-success btn-sm">+ New Input</span> and select *in.c-keboola-ex-db-snowflake.CARS* as the source table. Accept the suggested destination. It’s the table's name inside the transformation. Click <span class="btn btn-success btn-sm">Create Input</span>. Repeat the steps for the second table *in.c-keboola-ex-db-snowflake.POPULATION*.
<br/><br/>
**Output Mapping** — click <span class="btn btn-success btn-sm">+ New Output</span> and enter \`CARS_POPULATION\` as the source table. This table will be created in the transformation. Then set the destination to \`out.c-snowflake.CARS_POPULATION\`. It’s the name the new table *CARS_POPULATION* will have in Storage. Click <span class="btn btn-success btn-sm">Create Output</span>.
<br/><br/>
**Queries** — to create your output table, copy and paste this code: <br/> \`CREATE TABLE "CARS_POPULATION" AS SELECT "CARS".*, "POPULATION"."POPULATION", ("POPULATION"."POPULATION" / "CARS"."CARS") AS "PERSON_PER_CAR" FROM "CARS" JOIN "POPULATION" ON "CARS"."COUNTRY" = "POPULATION"."COUNTRY"\` <br/> Then <span class="btn btn-success btn-sm">Save</span> it.
<br/><br/>
To continue, click <span class="btn btn-primary btn-sm">Next step</span>.

`,
      'media': '',
      'mediaType': '',
      'route': {
        'name': 'transformationDetail',
        'params': [
          'config',
          'row'
        ]
      }
    }, {
      'id': 5,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Run Transformation',
      'markdown': 'Now when everything is ready, click <span class="btn btn-link btn-sm"> <i class="fa fa-play"></i> Run transformation</span> on the right. <br/><br/> The specified tables will be taken from Storage and put in a transformation database, where they will be changed by the queries. The result will be put back into Storage again. <br/><br/> To see the status of your extraction, click <span class="btn btn-primary btn-sm">Next step</span>.',
      'media': '',
      'mediaType': '',
      'route': {
        'name': 'transformationDetail',
        'params': [
          'config',
          'row'
        ]
      }
    }, {
      'id': 6,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Check Jobs',
      'markdown': 'In the section **Jobs**, you can find all operations you have run in your project so far. <br/><br/> The status of your transformation job probably says **processing** now. It will change to **success** in a little while. Your input tables will be joined, the ratio of motor vehicles to persons per country will be calculated, and the output table *CARS_POPULATION* will be created. You can check the details of each job here too.' +
      '<br/><br/> When you are ready, click <span class="btn btn-primary btn-sm">Next step</span>.',
      'media': '',
      'mediaType': '',
      'route': {
        'name': 'jobs',
        'params': []
      }
    }, {
      'id': 7,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Check Storage',
      'markdown': 'To see what the final table looks like, check its data sample in Storage. Just click on the bucket **out.c-snowflake** on the left. Then click on the table *CARS_POPULATION* and select the tab **Data sample**.',
      'media': '',
      'mediaType': '',
      'route': {
        'name': 'storage',
        'params': []
      },
      'previousLink': 'jobs',
      'nextLink': ''
    }, {
      'id': 8,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Learn More',
      'route': {
        'name': '',
        'params': []
      },
      'markdown': 'In this lesson, you created a basic transformation in Keboola Connection. To see how to write the output data into Tableau, continue to the next lesson — Visualizing Results. <br/><br/> Learn more about <a href="https://help.keboola.com/manipulation/" target="_blank">Data Manipulation</a>, or follow the hands-on tutorial on data transformation in our <a href="https://help.keboola.com/tutorial/load" target="_blank">user documentation</a>.'
    }
  ]
};

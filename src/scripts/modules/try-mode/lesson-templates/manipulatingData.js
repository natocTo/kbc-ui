import ComponentsConstants from '../../components/Constants';
import JobsConstants from '../../jobs/Constants';
import TransformationsConstants from '../../transformations/Constants';

const {JOB_LOAD_SUCCESS} = JobsConstants.ActionTypes;
const {TRANSFORMATION_BUCKET_CREATE_SUCCESS, TRANSFORMATION_CREATE_SUCCESS} = TransformationsConstants.ActionTypes;
const {VERSIONS_LOAD_SUCCESS} = ComponentsConstants.ActionTypes;

export default {
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
      'markdown': 'Before creating our transformation, we need to create a new bucket which serves as folder for Transformations. You will benefit from buckets later in the process.',
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
      'markdown': 'Let’s add a new transformation into the new bucket by clicking on **+ New Transformation**, select MySQL as the backend (the engine running the transformation script)',
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
      'Now let’s specify '

      + `
- **Input Mapping** what tables will be used in the transformation.
- **Output Mapping** what tables will be written to Storage as results.
- **Queries** what will happen with the data in the transformation.



### TO DO:

- Click on **+ Add Input** and select \`in.c-tutorial.cars\` as Source
- Click on **+ Add Output**, set Destination at \`out.c-snowflake.transformed\`
- Add Query \`CREATE TABLE transformed AS
SELECT cars.*, population.POPULATION, (population.POPULATION / cars.CARS) AS PERSON_PER_CAR
FROM cars JOIN population
On cars.COUNTRY = population.COUNTRY\` and **Save** it.
- Click on **Next Step**

`,
      'media': '',
      'mediaType': '',
      'nextStepDispatchAction': {type: VERSIONS_LOAD_SUCCESS}
    }, {
      'id': 5,
      'position': 'aside',
      'backdrop': false,
      'title': 'Run Transformation',
      'link': '',
      'isNavigationVisible': true,
      'markdown': 'Now when everything is ready, we can run the transformation. The specified tables will be taken from Storage and put in a transformation database where they will be changed by the queries. The result will be put to Storage again.',
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
      'markdown': 'Here you can see that the transformation job was successful. Our input tables were merged and the output table transformed was created.',
      'media': '',
      'mediaType': ''
    }, {
      'id': 7,
      'position': 'aside',
      'backdrop': false,
      'title': 'Check Storage',
      'link': 'home',
      'isNavigationVisible': true,
      'markdown': 'We can see what the final table looks like in this Data Sample in Storage. To see how to write the output data from Keboola Connection, continue with the next step - Visualizing Results. Learn more about [Data Manipulation](https://help.keboola.com/manipulation/), or follow a hands-on tutorial on data transformation in our [user documentation](https://help.keboola.com/tutorial/load).',
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

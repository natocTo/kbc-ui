import ComponentsConstants from '../../components/Constants';
import JobsConstants from '../../jobs/Constants';

const {COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS} = ComponentsConstants.ActionTypes;
const {JOB_LOAD_SUCCESS} = JobsConstants.ActionTypes;
export default {
  'id': 4,
  'title': 'Visualizing Results',
  'steps': [
    {
      'id': 1,
      'position': 'center',
      'layout': 'content',
      'backdrop': true,
      'title': 'Introduction',
      'link': 'home',
      'isNavigationVisible': true,
      'markdown': 'Transformation results can be delivered to any analytics or business intelligence tool. <br/><br/> In this lesson, you are going to take the table you created in your transformation in Lesson 3 and generate a Tableau Data Extract (TDE). You will then load it manually into Tableau Desktop for visualization using yet another Keboola Connection component – a Writer. <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
      'media': 'kbc_scheme_light_blue-wri.svg',
      'mediaType': 'img'
    },
    {
      'id': 2,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Create Writer',
      'link': 'writers',
      'nextStepDispatchAction': {type: COMPONENTS_NEW_CONFIGURATION_SAVE_SUCCESS, componentId: 'tde-exporter'},
      'isNavigationVisible': true,
      'media': '',
      'markdown': 'Let’s say you have Tableau Desktop installed. Now you need to find the writer Tableau in the **Writers** section.'
                + `
- Click on **+ New Writer**.
- Find **Tableau**. You can use the search feature to find it faster.
- Click on **More** and continue with **+ New Configuration**.
- Name the configuration, e.g., *My writer* and click on **Create Configuration**.
`,
      'mediaType': ''
    },
    {
      'id': 3,
      'layout': 'content',
      'position': 'aside',
      'backdrop': false,
      'title': 'Create Table',
      'nextStepDispatchAction': {type: JOB_LOAD_SUCCESS},
      'markdown':
      'Now add the table you want to send to Tableau. For each of its columns you also need to specify whether it contains text or a number.'
      + `
- Click on **+ New Table**.
- Select  \`out.c-snowflake.transformed\` as the Source table you want to add to Tableau.
- Specify a data type for each of the table's columns under **TDE Data Type** (COUNTRY/string, CARS/number, POPULATION/number, PERSON_PER_CAR/decimal) 
- **Save** the configuration.
- Click **Export tables to TDE** to run the writer. A Tableau Desktop Extract file will be created. In a real project, you would be able to save the file to your computer and find it in Storage.   
`
    },
    {
      'id': 4,
      'layout': 'content',
      'position': 'center',
      'backdrop': true,
      'title': 'Run Extracion',
      'markdown': 'For the purposes of the Guide Mode, let’say you have downloaded the Tableau Desktop Extract file to your computer and opened it in Tableau. The graph below is one of many reports you can create. <br/><br/> To see how to automate the whole process, continue to the next lesson – Project Automation. <br/><br/> Learn more about <a href="https://help.keboola.com/writers/" target="_blank">Writers</a>, or follow a hands-on tutorial on writing data in our <a href="https://help.keboola.com/tutorial/write/" target="_blank">user documentation</a>.',
      'media': 'tbl.png',
      'mediaType': 'img'
    }
  ]
};

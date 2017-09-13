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
      'backdrop': true,
      'title': 'Introduction',
      'link': 'home',
      'isNavigationVisible': true,
      'markdown': 'Transformation results can be delivered to any analytics or business intelligence tool. In this lesson, we are going to generate a Tableau Data Extract and load it manually into Tableau Desktop for visualization using yet another Keboola Connection component – a Writer. <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
      'media': 'kbc_scheme_light_blue-wri.svg',
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
      'title': 'Create Table',
      'nextStepDispatchAction': {type: JOB_LOAD_SUCCESS},
      'markdown':
      'Then let’s add the table we want to send to Tableau. For each of its columns we also need to specify whether it contains text or a number.'
      + `
- Click on **+ New Table**
- Select  \`in.c-tutrial.cars\`
- Select proper **TDE Data Type** and **Save** this table
- click **Export tables to TDE**

`,
      'isNavigationVisible': true
    },

    {
      'id': 4,
      'position': 'center',
      'backdrop': true,
      'title': 'Run Extracion',
      'isNavigationVisible': false,
      'markdown': 'The final step is to open the downloaded file in Tableau and create any reports we want. To see how to automate the whole process, continue to the next lesson - Project Automation. Learn more about <a href="https://help.keboola.com/orchestrator/" target="_blank">Automation</a>, or follow a hands-on tutorial on automation in our <a href="https://help.keboola.com/tutorial/automate/" target="_blank">user documentation</a>.',
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
};

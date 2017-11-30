export default {
  'id': 4,
  'title': 'Visualizing Results',
  'steps': [
    {
      'id': 1,
      'position': 'center',
      'backdrop': true,
      'title': 'Introduction',
      'link': 'app',
      'isNavigationVisible': false,
      'markdown': 'Transformation results can be delivered to any analytics or business intelligence tool. <br/><br/> In this lesson, you are going to take the table you created in your transformation in Lesson 3 and generate a Tableau Data Extract (TDE) file. You will then load the file manually into Tableau Desktop for visualization using yet another Keboola Connection component – Writer. <br/><br/> _Note: Your own projects won’t be affected by this in any way._',
      'media': 'kbc_scheme_light_blue-wri.svg',
      'mediaType': 'img'
    },
    {
      'id': 2,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Create Writer',
      'link': 'writers',
      'media': '',
      'markdown': 'Imagine you have <a href="https://www.tableau.com/products/desktop/download" target="_blank">Tableau Desktop</a> installed on your computer. Now you need to find the writer Tableau in the section **Writers**.'
      + `
- Find **Tableau**. You can use the search feature to find it faster.
- Click on <span class="btn btn-success btn-sm">More</span> and continue with <span class="btn btn-success btn-sm">+ New Configuration</span>.
- Name the configuration, e.g., My writer, and click on <span class="btn btn-success btn-sm">Create Configuration</span>.
`,
      'mediaType': ''
    },
    {
      'id': 3,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Create Table',
      'markdown': 'Now add the table you want to send to Tableau. For each of its columns you also need to specify whether it contains text or a number.'
      + `
- Click on <span class="btn btn-success btn-sm">+ New Table</span>.
- Select  *out.c-snowflake.CARS_POPULATION* as the Source table you want to add to Tableau and click <span class="btn btn-success btn-sm">Select</span>.
- Specify a data type for each of the table's columns under **TDE Data Type** (COUNTRY/string, CARS/number, POPULATION/number, PERSON_PER_CAR/decimal). 
- <span class="btn btn-success btn-sm">Save</span> the configuration.
- To continue, click <span class="btn btn-primary btn-sm">Next step</span>.
`,
      'mediaType': ''
    },
    {
      'id': 4,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Run Writer',
      'markdown':
      'To run the writer, click <span class="btn btn-link btn-sm"> <i class="fa fa-play"></i> Export tables to TDE</span>. A Tableau Desktop Extract file will be created. You can find it in the section **Storage** under the tab **Files**, from where it can be downloaded. <br/><br/> For the purposes of the Guide Mode, let’s say you have already downloaded the Tableau Desktop Extract file to your computer and opened it in Tableau. To see one of the many reports you can create, click <span class="btn btn-primary btn-sm">Next step</span>.'
`
    },
    {
      'id': 5,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Tableau Report',
      'media': 'tbl.png',
      'mediaType': 'img'
    },
    {
      'id': 6,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Learn More',
      'markdown': 'In this lesson, you were shown how easy it is to export your data from Keboola Connection and visualize the results. To see how to automate the whole process, continue to the next lesson – Project Automation. <br/><br/> Learn more about <a href="https://help.keboola.com/writers/" target="_blank">Writers</a>, or follow the hands-on tutorial on writing data in our <a href="https://help.keboola.com/tutorial/write/" target="_blank">user documentation</a>.'
    }
  ]
};

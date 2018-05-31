export default {
  'id': 4,
  'title': 'Visualizing Results',
  'steps': [
    {
      'id': 1,
      'position': 'center',
      'backdrop': true,
      'title': 'Introduction',
      'isNavigationVisible': false,
      'markdown': 'Transformation results can be delivered to any analytics or business intelligence tool. <br/><br/> In this lesson, you are going to take the table you created in your transformation in Lesson 3, and generate a Tableau Data Extract (TDE) file, using yet another Keboola Connection component – Writer. The file will be manually loaded into Tableau Desktop for visualization.',
      'media': 'kbc_scheme_light_blue-wri.svg',
      'mediaType': 'img',
      'route': {
        'name': 'app',
        'params': []
      }
    },
    {
      'id': 2,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Create Writer',
      'media': '',
      'markdown': 'Let’s assume you have <a href="https://www.tableau.com/products/desktop/download" target="_blank">Tableau Desktop</a> installed on your computer. Now you need to find the writer Tableau in the section **Writers**.'
      + `
- Find **Tableau**. You can use the search feature to find it faster.
- Click on component and continue with <span class="btn btn-success btn-sm">+ New Configuration</span>.
- Name the configuration, e.g., _Guide writer_, and click on <span class="btn btn-success btn-sm">Create Configuration</span>.
`,
      'mediaType': '',
      'route': {
        'name': 'writers',
        'params': []
      }
    },
    {
      'id': 3,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Select Table',
      'markdown': 'Now add the table you want to send to Tableau. For each of its columns, you also need to specify whether it contains text or a number.'
      + `
- Click on <span class="btn btn-success btn-sm">+ New Table</span>.
- Select  *out.c-guide.cars_population* as the source table you want to add to Tableau and click <span class="btn btn-success btn-sm">Select</span>.
- Specify a data type for each of the table's columns under TDE Data Type (name -> string, total_cars -> number, population -> number, cars_per_capita -> decimal). 
- <span class="btn btn-success btn-sm">Save</span> the configuration.
- To continue, click <span class="btn btn-primary btn-sm">Next step <i class="fa fa-chevron-right"></i></span>.
`,
      'mediaType': '',
      'route': {
        'name': 'tde-exporter',
        'params': [
          'config'
        ]
      }
    },
    {
      'id': 4,
      'position': 'aside',
      'backdrop': false,
      'isNavigationVisible': true,
      'title': 'Run Writer',
      'markdown': 'To run the writer, click on <span class="btn btn-link btn-sm"><i class="fa fa-play"></i> Export tables to TDE</span>. After your Tableau Desktop Extract file is created, it can be downloaded by clicking on the link <a href="#" class="guide-link guide-link-fake">out.c_guide.cars_population.tde</a> and then loaded into Tableau Desktop. <br/><br/> For the purposes of the Guide Mode, let’s say you have already downloaded the file to your computer, and opened it in Tableau. To see one of the many reports you can create, click <span class="btn btn-primary btn-sm">Next step <i class="fa fa-chevron-right"></i></span>.',
      'route': {
        'name': 'tde-exporter',
        'params': [
          'config'
        ]
      }
    },
    {
      'id': 5,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Tableau Report',
      'media': 'tbl.png',
      'mediaType': 'img',
      'route': {
        'name': 'tde-exporter',
        'params': [
          'config'
        ]
      }
    },
    {
      'id': 6,
      'position': 'center',
      'backdrop': true,
      'isNavigationVisible': false,
      'title': 'Learn More',
      'markdown': 'This lesson gave you a taste of how easy it is to export data from Keboola Connection and visualize the results. To see how to automate the whole process, continue to the next lesson – Project Automation. <br/><br/> Learn more about <a href="https://help.keboola.com/writers/" target="_blank">Writers</a>, or follow the hands-on tutorial on writing data in our <a href="https://help.keboola.com/tutorial/write/" target="_blank">user documentation</a>.',
      'route': {
        'name': 'app',
        'params': []
      }
    }
  ]
};

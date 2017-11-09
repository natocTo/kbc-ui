export default {
  'id': 1,
  'title': 'Basic Overview',
  'steps': [
    {
      'id': 1,
      'position': 'center',
      'layout': 'content',
      'backdrop': true,
      'title': 'Introduction',
      'link': 'home',
      'markdown': 'This lesson gives you a basic overview of the Keboola Connection environment. Its interconnected components help you extract data from various sources, manipulate and enrich the data, write the results to visualizing tools of your choice, etc. In addition, the whole process can be fully automated.',
      'media': 'kbc_scheme_light_blue.svg',
      'mediaType': 'img'
    },
    {
      'id': 2,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Extract data',
      'link': 'extractors',
      'markdown': 'Every project in Keboola Connection starts by loading data. It is done with **Extractors** &ndash; components for importing data from your company’s internal databases, external sources, such as Facebook or YouTube, and from your own computer.',
      'media': 'https://www.youtube.com/embed/g-VBfkV4xfc',
      'mediaType': 'video'
    },
    {
      'id': 3,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Store data',
      'link': 'storage',
      'markdown': 'All data you upload to your project, as well as all the tables your project creates, are stored in **Storage** where they can be accessed at any time. To find what you need quickly, the data tables are organized into buckets.',
      'media': 'kbc_scheme_light_blue.svg',
      'mediaType': 'img'
    },
    {
      'id': 4,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Manipulate data',
      'link': 'transformations',
      'markdown': 'Now it’s time to mix, clean and work with the extracted data. In **Transformations**, use your own script (SQL, Python, R or OpenRefine) for manipulation with the data. <br/><br/> Apart from Transformations, ready-to-use **Applications** created by Keboola or third parties are also available.',
      'media': '',
      'mediaType': ''

    },
    {
      'id': 5,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Write results',
      'link': 'writers',
      'markdown': 'Once you’re happy with your results, let **Writers** deliver them to their final destination –  the systems and applications where the output data gets used or consumed, for instance, visualizing tools or databases.',
      'media': '',
      'mediaType': ''
    },
    {
      'id': 6,
      'position': 'aside',
      'layout': 'content',
      'backdrop': false,
      'title': 'Automate',
      'link': 'orchestrations',
      'markdown': 'If you want to work with the latest data available, the whole sequence must be done over and over again. This is where full automation of your projects comes in. <br/><br/> **Orchestrations** allow you to specify at what time or how often your tasks should be executed and in what order.',
      'media': '',
      'mediaType': ''

    },
    {
      'id': 7,
      'position': 'center',
      'layout': 'content',
      'backdrop': true,
      'title': 'Example Workflow',
      'link': 'home',
      'markdown': 'Having learned all the basics, you can explore the individual steps in more detail in the lessons that follow. <br/><br/> After extracting data from two database tables, merging them into one table, and calculating some statistics, you will visualize the results. Finally, you will set up the whole process to run automatically. See our example workflow below.',
      'media': 'kbc_scheme_light_blue.svg',
      'mediaType': 'img'
    }
  ]
};

const cases = {
  empty: {
    localState: {},
    configuration: {}
  },
  emptyWithDefaults: {
    localState: {
      bucket: '',
      key: '',
      name: '',
      wildcard: false,
      subfolders: false,
      incremental: false,
      newFilesOnly: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '"',
      columns: [],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: '',
        key: '',
        saveAs: '',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '"',
              incremental: false,
              primary_key: [],
              columns: []
            }
          }
        ]
      }
    }
  },
  simple: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: false,
      incremental: false,
      newFilesOnly: false,
      primaryKey: ['col1'],
      delimiter: ',',
      enclosure: '"',
      columns: ['col1', 'col2'],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '"',
              incremental: false,
              primary_key: ['col1'],
              columns: ['col1', 'col2']
            }
          }
        ]
      }
    }
  },
  wildcard: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: true,
      subfolders: false,
      incremental: false,
      newFilesOnly: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '"',
      columns: [],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey*',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '"',
              incremental: false,
              primary_key: [],
              columns: []
            }
          }
        ]
      }
    }
  },
  subfolders: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: true,
      incremental: false,
      newFilesOnly: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '"',
      columns: [],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: true,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '"',
              incremental: false,
              primary_key: [],
              columns: []
            }
          }
        ]
      }
    }
  },
  incremental: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: false,
      incremental: true,
      newFilesOnly: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '"',
      columns: [],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '"',
              incremental: true,
              primary_key: [],
              columns: []
            }
          }
        ]
      }
    }
  },
  newFilesOnly: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: false,
      incremental: false,
      newFilesOnly: true,
      primaryKey: [],
      delimiter: ',',
      enclosure: '"',
      columns: [],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: true
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '"',
              incremental: false,
              primary_key: [],
              columns: []
            }
          }
        ]
      }
    }
  },
  primaryKey: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: false,
      incremental: false,
      newFilesOnly: false,
      primaryKey: ['col'],
      delimiter: ',',
      enclosure: '"',
      columns: [],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '"',
              incremental: false,
              primary_key: ['col'],
              columns: []
            }
          }
        ]
      }
    }
  },
  delimiter: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: false,
      incremental: false,
      newFilesOnly: false,
      primaryKey: [],
      delimiter: ';',
      enclosure: '"',
      columns: [],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ';',
              enclosure: '"',
              incremental: false,
              primary_key: [],
              columns: []
            }
          }
        ]
      }
    }
  },
  tabDelimiter: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: false,
      incremental: false,
      newFilesOnly: false,
      primaryKey: [],
      delimiter: '\t',
      enclosure: '"',
      columns: [],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: '\t',
              enclosure: '"',
              incremental: false,
              primary_key: [],
              columns: []
            }
          }
        ]
      }
    }
  },
  enclosure: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: false,
      incremental: false,
      newFilesOnly: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '\'',
      columns: [],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '\'',
              incremental: false,
              primary_key: [],
              columns: []
            }
          }
        ]
      }
    }
  },
  manualColumns: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: false,
      incremental: false,
      newFilesOnly: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '\'',
      columns: ['col1', 'col2'],
      columnsFrom: 'manual'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '\'',
              incremental: false,
              primary_key: [],
              columns: ['col1', 'col2']
            }
          }
        ]
      }
    }
  },
  autoColumns: {
    localState: {
      bucket: 'mybucket',
      key: 'mykey',
      name: 'mytable',
      wildcard: false,
      subfolders: false,
      incremental: false,
      newFilesOnly: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '\'',
      columns: [],
      columnsFrom: 'auto'
    },
    configuration: {
      parameters: {
        bucket: 'mybucket',
        key: 'mykey',
        saveAs: 'mytable',
        includeSubfolders: false,
        newFilesOnly: false
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              addCsvSuffix: true
            }
          },
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              delimiter: ',',
              enclosure: '\'',
              incremental: false,
              primary_key: [],
              columns: [],
              columns_from: 'auto'
            }
          }
        ]
      }
    }
  }
};

module.exports = {
  cases: cases
};

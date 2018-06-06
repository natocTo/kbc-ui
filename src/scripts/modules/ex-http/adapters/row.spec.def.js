export const cases = {
  emptyWithDefaults: {
    localState: {
      path: '',
      name: '',
      incremental: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '"',
      columns: [],
      columnsFrom: 'header',
      decompress: false
    },
    configuration: {
      parameters: {
        path: ''
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: ''
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
              columns_from: 'header'
            }
          },
          {
            definition: {
              component: 'keboola.processor-skip-lines'
            },
            parameters: {
              lines: 1
            }
          }
        ]
      }
    }
  },
  simple: {
    localState: {
      path: 'mykey',
      name: 'mytable',
      incremental: false,
      primaryKey: ['col1'],
      delimiter: ',',
      enclosure: '"',
      columns: ['col1', 'col2'],
      columnsFrom: 'manual',
      decompress: false
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
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
  incremental: {
    localState: {
      path: 'mykey',
      name: 'mytable',
      incremental: true,
      primaryKey: [],
      delimiter: ',',
      enclosure: '"',
      columns: ['col1', 'col2'],
      columnsFrom: 'manual',
      decompress: false
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
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
              columns: ['col1', 'col2']
            }
          }
        ]
      }
    }
  },
  primaryKey: {
    localState: {
      path: 'mykey',
      name: 'mytable',
      incremental: false,
      primaryKey: ['col1'],
      delimiter: ',',
      enclosure: '"',
      columns: ['col1', 'col2'],
      columnsFrom: 'manual',
      decompress: false
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
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
  delimiter: {
    localState: {
      path: 'mykey',
      name: 'mytable',
      incremental: false,
      primaryKey: [],
      delimiter: ';',
      enclosure: '"',
      columns: ['col1', 'col2'],
      columnsFrom: 'manual',
      decompress: false
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
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
              columns: ['col1', 'col2']
            }
          }
        ]
      }
    }
  },
  tabDelimiter: {
    localState: {
      path: 'mykey',
      name: 'mytable',
      incremental: false,
      primaryKey: [],
      delimiter: '\t',
      enclosure: '"',
      columns: ['col1', 'col2'],
      columnsFrom: 'manual',
      decompress: false
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
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
              columns: ['col1', 'col2']
            }
          }
        ]
      }
    }
  },
  enclosure: {
    localState: {
      path: 'mykey',
      name: 'mytable',
      incremental: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '\'',
      columns: ['col1', 'col2'],
      columnsFrom: 'manual',
      decompress: false
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
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
  manualColumns: {
    localState: {
      path: 'mykey',
      name: 'mytable',
      incremental: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '\'',
      columns: ['col1', 'col2'],
      columnsFrom: 'manual',
      decompress: false
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
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
      path: 'mykey',
      name: 'mytable',
      incremental: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '\'',
      columns: [],
      columnsFrom: 'auto',
      decompress: false
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
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
              columns_from: 'auto'
            }
          }
        ]
      }
    }
  },
  headerColumns: {
    localState: {
      path: 'mykey',
      name: 'mytable',
      incremental: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '\'',
      columns: [],
      columnsFrom: 'header',
      decompress: false
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
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
              columns_from: 'header'
            }
          },
          {
            definition: {
              component: 'keboola.processor-skip-lines'
            },
            parameters: {
              lines: 1
            }
          }
        ]
      }
    }
  },
  decompress: {
    localState: {
      path: 'mykey',
      name: 'mytable',
      incremental: false,
      primaryKey: [],
      delimiter: ',',
      enclosure: '\'',
      columns: [],
      columnsFrom: 'header',
      decompress: true
    },
    configuration: {
      parameters: {
        path: 'mykey'
      },
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-decompress'
            }
          },
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'tables',
              folder: 'mytable'
            }
          },
          {
            definition: {
              component: 'keboola.processor-flatten-folders'
            },
            parameters: {
              starting_depth: 1
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
              columns_from: 'header'
            }
          },
          {
            definition: {
              component: 'keboola.processor-skip-lines'
            },
            parameters: {
              lines: 1
            }
          }
        ]
      }
    }
  }
};


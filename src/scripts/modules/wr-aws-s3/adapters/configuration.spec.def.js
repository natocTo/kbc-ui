export const cases = {
  emptyWithDefaults: {
    localState: {
      bucket: '',
      source: '',
      destination: ''
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: '',
              destination: ''
            }
          ]
        }
      },
      parameters: {
        bucket: '',
        prefix: ''
      },
      processors: {
        before: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'files'
            }
          }
        ]
      }
    }
  },
  simple: {
    localState: {
      bucket: 'mybucket',
      destination: 'myprefix/data.csv',
      source: 'in.c-main.data'
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: 'in.c-main.data',
              destination: 'data.csv'
            }
          ]
        }
      },
      parameters: {
        bucket: 'mybucket',
        prefix: 'myprefix/'
      },
      processors: {
        before: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'files'
            }
          }
        ]
      }
    }
  },
  prefix: {
    localState: {
      bucket: 'mybucket',
      destination: 'myprefix/nested/data.csv',
      source: 'in.c-main.data'
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: 'in.c-main.data',
              destination: 'data.csv'
            }
          ]
        }
      },
      parameters: {
        bucket: 'mybucket',
        prefix: 'myprefix/nested/'
      },
      processors: {
        before: [
          {
            definition: {
              component: 'keboola.processor-move-files'
            },
            parameters: {
              direction: 'files'
            }
          }
        ]
      }
    }
  }
};

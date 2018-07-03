export const cases = {
  emptyWithDefaults: {
    localState: {
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

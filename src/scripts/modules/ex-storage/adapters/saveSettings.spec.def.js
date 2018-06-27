export const cases = {
  emptyWithDefaults: {
    localState: {
      incremental: false,
      primaryKey: []
    },
    configuration: {
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              incremental: false,
              primary_key: []
            }
          }
        ]
      }
    }
  },
  simple: {
    localState: {
      incremental: false,
      primaryKey: ['col1']
    },
    configuration: {
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              incremental: false,
              primary_key: ['col1']
            }
          }
        ]
      }
    }
  },
  incremental: {
    localState: {
      incremental: true,
      primaryKey: []
    },
    configuration: {
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              incremental: true,
              primary_key: []
            }
          }
        ]
      }
    }
  },
  primaryKey: {
    localState: {
      incremental: false,
      primaryKey: ['col1']
    },
    configuration: {
      processors: {
        after: [
          {
            definition: {
              component: 'keboola.processor-create-manifest'
            },
            parameters: {
              incremental: false,
              primary_key: ['col1']
            }
          }
        ]
      }
    }
  }
};


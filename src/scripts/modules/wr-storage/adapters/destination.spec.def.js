export const cases = {
  emptyWithDefaults: {
    localState: {
      destination: '',
      incremental: false
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              destination: ''
            }
          ]
        }
      },
      parameters: {
        incremental: false
      }
    }
  },

  simple: {
    localState: {
      destination: 'test',
      incremental: true
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              destination: 'test'
            }
          ]
        }
      },
      parameters: {
        incremental: true
      }
    }
  }
};


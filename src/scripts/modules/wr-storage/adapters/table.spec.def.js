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
      }
    }
  },

  simple: {
    localState: {
      source: 'in.c-main.test',
      destination: 'test'
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: 'in.c-main.test',
              destination: 'test'
            }
          ]
        }
      }
    }
  }
};


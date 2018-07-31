export const cases = {
  emptyWithDefaults: {
    localState: {
      object: '',
      query: '',
      incremental: false
    },
    configuration: {
      parameters: {
        sinceLast: false,
        objects: [
          {
            name: '',
            soql: ''
          }
        ]
      }
    }
  },
  simple: {
    localState: {
      object: 'User',
      query: '',
      incremental: false
    },
    configuration: {
      parameters: {
        sinceLast: false,
        objects: [
          {
            name: 'User',
            soql: ''
          }
        ]
      }
    }
  },
  soql: {
    localState: {
      object: 'User',
      query: 'SELECT Id FROM User',
      incremental: false
    },
    configuration: {
      parameters: {
        sinceLast: false,
        objects: [
          {
            name: 'User',
            soql: 'SELECT Id FROM User'
          }
        ]
      }
    }
  },
  incremental: {
    localState: {
      object: 'User',
      query: '',
      incremental: true
    },
    configuration: {
      parameters: {
        sinceLast: true,
        objects: [
          {
            name: 'User',
            soql: ''
          }
        ]
      }
    }
  }
};

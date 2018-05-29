export const cases = {
  emptyWithDefaults: {
    localState: {
      url: '',
      token: ''
    },
    configuration: {
      parameters: {
        url: '',
        '#token': ''
      }
    }
  },

  simple: {
    localState: {
      url: 'https://connection.keboola.com/',
      token: 'test'
    },
    configuration: {
      parameters: {
        url: 'https://connection.keboola.com/',
        '#token': 'test'
      }
    }
  }
};


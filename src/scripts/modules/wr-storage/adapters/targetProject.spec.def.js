export const cases = {
  emptyWithDefaults: {
    localState: {
      url: '',
      token: '',
      bucket: ''
    },
    configuration: {
      parameters: {
        url: '',
        '#token': '',
        bucket: ''
      }
    }
  },

  simple: {
    localState: {
      url: 'https://connection.keboola.com/',
      token: 'test',
      bucket: 'in.c-mybucket'
    },
    configuration: {
      parameters: {
        url: 'https://connection.keboola.com/',
        '#token': 'test',
        bucket: 'in.c-mybucket'
      }
    }
  }
};


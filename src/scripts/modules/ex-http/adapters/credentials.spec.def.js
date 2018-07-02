export const cases = {
  emptyWithDefaults: {
    localState: {
      baseUrl: '',
      maxRedirects: ''
    },
    configuration: {
      parameters: {
        baseUrl: ''
      }
    }
  },

  simple: {
    localState: {
      baseUrl: 'https://example.com',
      maxRedirects: ''
    },
    configuration: {
      parameters: {
        baseUrl: 'https://example.com'
      }
    }
  },

  simpleWithMaxRedirects: {
    localState: {
      baseUrl: 'https://example.com',
      maxRedirects: 5
    },
    configuration: {
      parameters: {
        baseUrl: 'https://example.com',
        maxRedirects: 5
      }
    }
  }
};


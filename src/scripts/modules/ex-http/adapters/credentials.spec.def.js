const cases = {
  emptyWithDefaults: {
    localState: {
      baseUrl: ''
    },
    configuration: {
      parameters: {
        baseUrl: ''
      }
    }
  },

  simple: {
    localState: {
      baseUrl: 'https://example.com'
    },
    configuration: {
      parameters: {
        baseUrl: 'https://example.com'
      }
    }
  }
};

module.exports = {
  cases: cases
};

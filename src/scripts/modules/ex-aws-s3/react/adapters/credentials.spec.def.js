const cases = {
  emptyWithDefaults: {
    localState: {
      awsAccessKeyId: '',
      awsSecretAccessKey: ''
    },
    configuration: {
      parameters: {
        accessKeyId: '',
        '#secretAccessKey': ''
      }
    }
  },

  simple: {
    localState: {
      awsAccessKeyId: 'awsAccessKeyId',
      awsSecretAccessKey: 'awsSecretAccessKey'
    },
    configuration: {
      parameters: {
        accessKeyId: 'awsAccessKeyId',
        '#secretAccessKey': 'awsSecretAccessKey'
      }
    }
  }
};

module.exports = {
  cases: cases
};

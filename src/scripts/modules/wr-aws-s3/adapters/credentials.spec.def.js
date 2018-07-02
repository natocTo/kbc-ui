export const cases = {
  emptyWithDefaults: {
    localState: {
      awsAccessKeyId: '',
      awsSecretAccessKey: '',
      bucket: ''
    },
    configuration: {
      parameters: {
        accessKeyId: '',
        '#secretAccessKey': '',
        'bucket': ''
      }
    }
  },

  simple: {
    localState: {
      awsAccessKeyId: 'awsAccessKeyId',
      awsSecretAccessKey: 'awsSecretAccessKey',
      bucket: 'mybucket'
    },
    configuration: {
      parameters: {
        accessKeyId: 'awsAccessKeyId',
        '#secretAccessKey': 'awsSecretAccessKey',
        'bucket': 'mybucket'
      }
    }
  }
};

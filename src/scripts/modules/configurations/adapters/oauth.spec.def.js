export const cases = {
  emptyWithDefaults: {
    localState: {
      oauthId: '',
      componentId: '',
      configurationId: ''
    },
    configuration: {
      authorization: {
        oauth_api: {
          id: ''
        }
      }
    },
    context: {
      componentId: '',
      configurationId: ''
    }
  },
  simple: {
    localState: {
      oauthId: '1234',
      componentId: '567',
      configurationId: '789'
    },
    configuration: {
      authorization: {
        oauth_api: {
          id: '1234'
        }
      }
    },
    context: {
      componentId: '567',
      configurationId: '789'
    }
  }
};


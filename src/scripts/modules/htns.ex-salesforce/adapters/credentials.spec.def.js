export const cases = {
  emptyWithDefaults: {
    localState: {
      login: '',
      password: '',
      securityToken: '',
      sandbox: false,
    },
    configuration: {
      parameters: {
        loginname: '',
        '#password': '',
        '#securitytoken': '',
        'sandbox': false
      }
    }
  },

  simple: {
    localState: {
      login: 'login',
      password: 'password',
      securityToken: 'securityToken',
      sandbox: false,
    },
    configuration: {
      parameters: {
        loginname: 'login',
        '#password': 'password',
        '#securitytoken': 'securityToken',
        'sandbox': false

      }
    }
  },

  sandbox: {
    localState: {
      login: 'login',
      password: 'password',
      securityToken: 'securityToken',
      sandbox: true,
    },
    configuration: {
      parameters: {
        loginname: 'login',
        '#password': 'password',
        '#securitytoken': 'securityToken',
        'sandbox': true
      }
    }
  }
};

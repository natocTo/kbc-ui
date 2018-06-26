export const cases = {
  emptyWithDefaults: {
    localState: {
      source: '',
      changedSince: ''
    },
    configuration: {
      parameters: {
        tableName: '',
        changedSince: ''
      }
    }
  },

  simple: {
    localState: {
      source: 'in.c-main.test',
      changedSince: '-1 days'
    },
    configuration: {
      parameters: {
        tableName: 'in.c-main.test',
        changedSince: '-1 days'
      }
    }
  }
};


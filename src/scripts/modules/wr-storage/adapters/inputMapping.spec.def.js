export const cases = {
  emptyWithDefaults: {
    localState: {
      source: '',
      changedSince: ''
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: '',
              changed_since: ''
            }
          ]
        }
      }
    }
  },

  simple: {
    localState: {
      source: 'in.c-main.test',
      changedSince: '-1 days'
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: 'in.c-main.test',
              changed_since: '-1 days'
            }
          ]
        }
      }
    }
  }
};


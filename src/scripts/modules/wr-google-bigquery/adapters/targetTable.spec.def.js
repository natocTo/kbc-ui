export const cases = {
  emptyWithDefaults: {
    localState: {
      name: '',
      table: ''
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: ''
            }
          ]
        }
      },
      parameters: {
        tables: [
          {
            dbName: '',
            tableId: ''
          }
        ]
      }
    }
  },
  simple: {
    localState: {
      name: 'test',
      table: 'in.c-main.test'
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: 'in.c-main.test'
            }
          ]
        }
      },
      parameters: {
        tables: [
          {
            dbName: 'test',
            tableId: 'in.c-main.test'
          }
        ]
      }
    }
  }
};


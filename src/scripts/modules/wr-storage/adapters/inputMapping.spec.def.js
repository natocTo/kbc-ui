export const cases = {
  emptyWithDefaults: {
    localState: {
      source: '',
      destination: '',
      columns: [],
      whereColumn: '',
      whereValues: [],
      whereOperator: 'eq',
      changedSince: ''
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: '',
              destination: '',
              columns: [],
              where_column: '',
              where_values: [],
              where_operator: 'eq',
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
      destination: 'test',
      columns: ['col1', 'col2'],
      whereColumn: 'col1',
      whereValues: ['val1', 'val2'],
      whereOperator: 'ne',
      changedSince: '-1 days'
    },
    configuration: {
      storage: {
        input: {
          tables: [
            {
              source: 'in.c-main.test',
              destination: 'test',
              columns: ['col1', 'col2'],
              where_column: 'col1',
              where_values: ['val1', 'val2'],
              where_operator: 'ne',
              changed_since: '-1 days'
            }
          ]
        }
      }
    }
  }
};


export const cases = {
  schema: {
    localState: {
      type: 'schema',
      schema_name: 'accounting'
    },
    configuration: {
      parameters: {
        business_schema: {
          schema_name: 'accounting'
        }
      }
    }
  },
  schemaNameEmptyString: {
    localState: {
      type: 'schema',
      schema_name: ''
    },
    configuration: {
      parameters: {
        business_schema: {
          schema_name: ''
        }
      }
    }
  },
  user: {
    localState: {
      type: 'user',
      email: 'tomas.fejfar@keboola.com',
      business_schemas: ['accounting', 'sales'],
      disabled: false
    },
    configuration: {
      parameters: {
        user: {
          email: 'tomas.fejfar@keboola.com',
          business_schemas: [
            'accounting', 'sales'
          ],
          disabled: false
        }
      }
    }
  },
  userEmailEmptyString: {
    localState: {
      type: 'user',
      email: '',
      business_schemas: ['accounting', 'sales'],
      disabled: false
    },
    configuration: {
      parameters: {
        user: {
          email: '',
          business_schemas: [
            'accounting', 'sales'
          ],
          disabled: false
        }
      }
    }
  }
};

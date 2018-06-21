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
  }
};

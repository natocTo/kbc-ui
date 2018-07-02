import Immutable from 'immutable';

export function createConfiguration(localState) {
  const isUser = localState.get('type') === 'user';
  const isSchema = localState.get('type') === 'schema';
  if (isUser) {
    return Immutable.fromJS({
      parameters: {
        user: {
          email: localState.get('email'),
          business_schemas: localState.get('business_schemas', []),
          disabled: localState.get('disabled', false)
        }
      }
    });
  }
  if (isSchema) {
    return Immutable.fromJS({
      parameters: {
        business_schema: {
          schema_name: localState.get('schema_name')
        }
      }
    });
  }
}

export function parseConfiguration(configuration) {
  const isUser = configuration.getIn(['parameters', 'user'], false) !== false;
  const isSchema = configuration.getIn(['parameters', 'business_schema'], false) !== false;

  if (isUser) {
    return Immutable.fromJS({
      type: 'user',
      email: configuration.getIn(['parameters', 'user', 'email']),
      business_schemas: configuration.getIn(['parameters', 'user', 'business_schemas']),
      disabled: configuration.getIn(['parameters', 'user', 'disabled'], false)
    });
  }
  if (isSchema) {
    return Immutable.fromJS({
      type: 'schema',
      schema_name: configuration.getIn(['parameters', 'business_schema', 'schema_name'])
    });
  }

  // schema is default
  return Immutable.fromJS({
    type: 'schema'
  });
}

export function createEmptyConfiguration(name) {
  return createConfiguration(Immutable.fromJS({type: 'schema', schema_name: name}));
}

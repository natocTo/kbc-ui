
const defaultFields = [
  {
    'label': 'Host Name',
    'name': 'host',
    'type': 'text',
    'protected': false,
    'required': true
  }, {
    'label': 'Port',
    'name': 'port',
    'type': 'number',
    'protected': false,
    'required': true
  }, {
    'label': 'Username',
    'name': 'user',
    'type': 'text',
    'protected': false,
    'required': true
  }, {
    'label': 'Password',
    'name': '#password',
    'type': 'password',
    'protected': true,
    'required': true
  }, {
    'label': 'Database',
    'name': 'database',
    'type': 'text',
    'protected': false,
    'required': true
  }
];

const COMPONENTS_FIELDS = {
  'keboola.ex-mongodb': defaultFields
};


export function getFields(componentId) {
  if (COMPONENTS_FIELDS[componentId]) {
    return COMPONENTS_FIELDS[componentId];
  } else {
    return defaultFields;
  }
}

// returns @array of properties that needs to be hashed
// should return only password property in most cases
export function getProtectedProperties(componentId) {
  let result = [];
  getFields(componentId).forEach(function(f) {
    if (f.protected) {
      result.push(f.name);
    }
  });
  return result;
}

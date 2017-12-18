/**
 * label
 * property(from API call)
 * type('text','number'...)
 * isProtected(true|false)
 * defaultValue
 * options(array)
 * isRequired(true|false)
 * help text
 */
const defaultFields = [
  [ 'Host name', 'host', 'text', false, null, [], true, null],
  [ 'Port', 'port', 'number', false, '3306', [], true, null],
  [ 'Username', 'user', 'text', false, null, [], true, null],
  [ 'Password', 'password', 'password', true, null, [], true, null],
  [ 'Database', 'database', 'text', false, null, [], true, null]
];

// keboola.wr-db-mssql-v2
const microsoftSQLFields = [
  [ 'Host name', 'host', 'text', false, null, [], true, null],
  [ 'Instance name', 'instance', 'text', false, null, [], false, 'Optional instance name'],
  [ 'Port', 'port', 'number', false, '1433', [], true, null],
  [ 'Username', 'user', 'text', false, null, [], true, null],
  [ 'Password', '#password', 'password', true, null, [], true, null],
  [ 'Database', 'database', 'text', false, null, [], true, null],
  [ 'Server Version', 'tdsVersion', 'select', false, '7.1', {
    '7.0': 'Microsoft SQL Server 7.0',
    '7.1': 'Microsoft SQL Server 2000',
    '7.2': 'Microsoft SQL Server 2005',
    '7.3': 'Microsoft SQL Server 2008',
    '7.4': 'Microsoft SQL Server 2012 or newer'
  }, true, null]
];

// keboola.wr-db-mysql
const mysqlFields = [
  [ 'Host name', 'host', 'text', false, null, [], true, null],
  [ 'Port', 'port', 'number', false, '3306', [], true, null],
  [ 'Username', 'user', 'text', false, null, [], true, null],
  [ 'Password', '#password', 'password', true, null, [], true, null],
  [ 'Database', 'database', 'text', false, null, [], true, null]
];

// keboola.wr-db-impala
const impalaFields = [
  [ 'Host name', 'host', 'text', false, null, [], true, null],
  [ 'Port', 'port', 'number', false, '21050', [], true, null],
  [ 'Username', 'user', 'text', false, null, [], true, null],
  [ 'Password', '#password', 'password', true, null, [], true, null],
  [ 'Database', 'database', 'text', false, null, [], true, null],
  [ 'Authentication mechanism', 'auth_mech', 'number', false, '3', [], true, null]
];

// keboola.wr-redshift-v2
const redshiftFields = [
  [ 'Host name', 'host', 'text', false, null, [], true, null],
  [ 'Port', 'port', 'number', false, '5439', [], true, null],
  [ 'Username', 'user', 'text', false, null, [], true, null],
  [ 'Password', '#password', 'password', true, null, [], true, null],
  [ 'Database', 'database', 'text', false, null, [], true, null],
  [ 'Schema', 'schema', 'text', false, null, [], true, null]
];

// keboola.wr-db-oracle
const oracleFields = [
  [ 'Host name', 'host', 'text', false, null, [], true, null],
  [ 'Port', 'port', 'number', false, '1521', [], true, null],
  [ 'Username', 'user', 'text', false, null, [], true, null],
  [ 'Password', '#password', 'password', true, null, [], true, null],
  [ 'Service Name/SID', 'database', 'text', false, null, [], true, null]
];

// keboola.wr-db-snowflake
const snowflakeFields = [
  [ 'Host name', 'host', 'text', false, null, [], true, null],
  [ 'Port', 'port', 'number', false, '443', [], true, null],
  [ 'Username', 'user', 'text', false, null, [], true, null],
  [ 'Password', '#password', 'password', true, null, [], true, null],
  [ 'Database', 'database', 'text', false, null, [], true, null],
  [ 'Schema', 'schema', 'text', false, null, [], true, null],
  [ 'Warehouse', 'warehouse', 'text', false, null, [], false, null]
];

// keboola.wr-db-pgsql
const pgsqlFields = [
  [ 'Host name', 'host', 'text', false, null, [], true, null],
  [ 'Port', 'port', 'number', false, '5432', [], true, null],
  [ 'Username', 'user', 'text', false, null, [], true, null],
  [ 'Password', '#password', 'password', true, null, [], true, null],
  [ 'Database', 'database', 'text', false, null, [], true, null],
  [ 'Schema', 'schema', 'text', false, 'public', [], true, null]
];

const COMPONENTS_FIELDS = {
  'keboola.wr-db-mssql-v2': microsoftSQLFields,
  'keboola.wr-db-mysql': mysqlFields,
  'keboola.wr-db-impala': impalaFields,
  'keboola.wr-redshift-v2': redshiftFields,
  'keboola.wr-db-oracle': oracleFields,
  'keboola.wr-db-snowflake': snowflakeFields,
  'keboola.wr-db-pgsql': pgsqlFields
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
  let fields = getFields(componentId);
  fields.forEach(function(f) {
    let isProtected = f[3];
    let propName = f[1];
    if (isProtected) {
      result.push(propName);
    }
  });
  return result;
}

// returns @array of properties that cannot be empty
export function getRequiredProperties(componentId) {
  let result = [];
  let fields = getFields(componentId);
  fields.forEach(function(f) {
    let isRequired = f[6];
    let propName = f[1];
    if (isRequired) {
      result.push(propName);
    }
  });
  return result;
}

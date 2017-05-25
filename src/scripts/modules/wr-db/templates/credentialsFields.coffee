# custom fields for credentials
#
# label
# property(from API call)
# type('text','number'...)
# isProtected(true|false)
# defaultValue
# options(array)
# isRequired(true|false)
# help text


defaultFields = [
  [ 'Host name', 'host', 'text', false, null, [], true, null]
  [ 'Port', 'port', 'number', false, '3306', [], true, null]
  [ 'Username', 'user', 'text', false, null, [], true, null]
  [ 'Password', 'password', 'password', true, null, [], true, null]
  [ 'Database Name', 'database', 'text', false, null, [], true , null]
]

fields =
  'wr-db-oracle': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Port', 'port', 'number', false, '1521', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', 'password', 'password', true, null, [], true, null]
    [ 'Service Name/SID', 'database', 'text', false, null, [], true, null]
  ]

  'wr-db-redshift': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Port', 'port', 'number', false, '5439', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', 'password', 'password', true, null, [], true, null]
    [ 'Database Name', 'database', 'text', false, null, [], true, null]
    [ 'Schema', 'schema', 'text', false, null, [], true, null]
  ]

  'wr-db-mssql': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Port', 'port', 'number', false, '1433', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', 'password', 'password', true, null, [], true, null]
    [ 'Database Name', 'database', 'text', false, null, [], true, null]
  ]

  'keboola.wr-db-mssql-v2': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Instance name', 'instance', 'text', false, null, [], false, 'Optional instance name']
    [ 'Port', 'port', 'number', false, '1433', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', '#password', 'password', true, null, [], true, null]
    [ 'Database Name', 'database', 'text', false, null, [], true, null]
    [ 'Server Version', 'tdsVersion', 'select', false, '7.1', {
      '7.0': 'Microsoft SQL Server 7.0'
      '7.1': 'Microsoft SQL Server 2000'
      '7.2': 'Microsoft SQL Server 2005'
      '7.3': 'Microsoft SQL Server 2008'
      '7.4': 'Microsoft SQL Server 2012 or newer'
    }, true, null]
  ]

  'keboola.wr-db-mysql': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Port', 'port', 'number', false, '3306', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', '#password', 'password', true, null, [], true, null]
    [ 'Database Name', 'database', 'text', false, null, [], true, null]
  ]

  'keboola.wr-db-impala': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Port', 'port', 'number', false, '21050', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', '#password', 'password', true, null, [], true, null]
    [ 'Database Name', 'database', 'text', false, null, [], true, null]
    [ 'Authentication mechanism', 'auth_mech', 'number', false, '3', [], true, null]
  ]

  'keboola.wr-redshift-v2': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Port', 'port', 'number', false, '5439', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', '#password', 'password', true, null, [], true, null]
    [ 'Database Name', 'database', 'text', false, null, [], true, null]
    [ 'Schema', 'schema', 'text', false, null, [], true, null]
  ]

  'keboola.wr-db-oracle': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Port', 'port', 'number', false, '1521', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', '#password', 'password', true, null, [], true, null]
    [ 'Service Name/SID', 'database', 'text', false, null, [], true, null]
  ]

  'keboola.wr-db-snowflake': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Port', 'port', 'number', false, '443', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', '#password', 'password', true, null, [], true, null]
    [ 'Database Name', 'database', 'text', false, null, [], true, null]
    [ 'Schema', 'schema', 'text', false, null, [], true, null]
    [ 'Warehouse', 'warehouse', 'text', false, null, [], false, null]
  ]

  'keboola.wr-db-pgsql': [
    [ 'Host name', 'host', 'text', false, null, [], true, null]
    [ 'Port', 'port', 'number', false, '5432', [], true, null]
    [ 'Username', 'user', 'text', false, null, [], true, null]
    [ 'Password', '#password', 'password', true, null, [], true, null]
    [ 'Database Name', 'database', 'text', false, null, [], true, null]
    [ 'Schema', 'schema', 'text', false, 'public', [], true, null]
  ]


module.exports = (componentId) ->
  fields[componentId] or defaultFields

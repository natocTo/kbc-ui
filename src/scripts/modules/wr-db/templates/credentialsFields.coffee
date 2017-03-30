# custom fields for credentials
#
# label
# property(from API call)
# type('text','number'...)
# isProtected(true|false)
# isRequired(true|false)
# defaultValue
# options(array)
# isRequired(true|false)


defaultFields = [
  [ 'Host name', 'host', 'text', false, null, [], true]
  [ 'Port', 'port', 'number', false, '3306', [], true]
  [ 'Username', 'user', 'text', false, null, [], true]
  [ 'Password', 'password', 'password', true, null, [], true]
  [ 'Database Name', 'database', 'text', false, null, [], true]
]

fields =
  'wr-db-oracle': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '1521', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', 'password', 'password', true, null, [], true]
    [ 'Service Name/SID', 'database', 'text', false, null, [], true]
  ]

  'wr-db-redshift': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '5439', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', 'password', 'password', true, null, [], true]
    [ 'Database Name', 'database', 'text', false, null, [], true]
    [ 'Schema', 'schema', 'text', false, null, [], true]
  ]

  'wr-db-mssql': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '1433', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', 'password', 'password', true, null, [], true]
    [ 'Database Name', 'database', 'text', false, null, [], true]
  ]

  'keboola.wr-db-mssql-v2': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '1433', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', '#password', 'password', true, null, [], true]
    [ 'Database Name', 'database', 'text', false, null, [], true]
    [ 'Server Version', 'tdsVersion', 'select', false, '7.1', {
      '7.0': 'Microsoft SQL Server 7.0'
      '7.1': 'Microsoft SQL Server 2000'
      '7.2': 'Microsoft SQL Server 2005'
      '7.3': 'Microsoft SQL Server 2008'
      '7.4': 'Microsoft SQL Server 2012 or newer'
    }, true]
  ]

  'keboola.wr-db-mysql': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '3306', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', '#password', 'password', true, null, [], true]
    [ 'Database Name', 'database', 'text', false, null, [], true]
  ]

  'keboola.wr-db-impala': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '21050', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', '#password', 'password', true, null, [], true]
    [ 'Database Name', 'database', 'text', false, null, [], true]
    [ 'Authentication mechanism', 'auth_mech', 'number', false, '3', [], true]
  ]

  'keboola.wr-redshift-v2': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '5439', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', '#password', 'password', true, null, [], true]
    [ 'Database Name', 'database', 'text', false, null, [], true]
    [ 'Schema', 'schema', 'text', false, null, [], true]
  ]

  'keboola.wr-db-oracle': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '1521', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', '#password', 'password', true, null, [], true]
    [ 'Service Name/SID', 'database', 'text', false, null, [], true]
  ]

  'keboola.wr-db-snowflake': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '443', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', '#password', 'password', true, null, [], true]
    [ 'Database Name', 'database', 'text', false, null, [], true]
    [ 'Schema', 'schema', 'text', false, null, [], true]
    [ 'Warehouse', 'warehouse', 'text', false, null, [], false]
  ]

  'keboola.wr-db-pgsql': [
    [ 'Host name', 'host', 'text', false, null, [], true]
    [ 'Port', 'port', 'number', false, '5432', [], true]
    [ 'Username', 'user', 'text', false, null, [], true]
    [ 'Password', '#password', 'password', true, null, [], true]
    [ 'Database Name', 'database', 'text', false, null, [], true]
    [ 'Schema', 'schema', 'text', false, 'public', [], true]
  ]


module.exports = (componentId) ->
  fields[componentId] or defaultFields

# define as [labelValue, propName, type = 'text', isProtected = false, isRequired = false]

defaultFields = [
  ['Host Name', 'host', 'text', false, true]
  ['Port', 'port', 'number', false, true]
  ['Username', 'user', 'text', false, true]
  ['Password', '#password', 'password', true, true]
  ['Database', 'database', 'text', false, true]
]


# impala fields:
# host: impala
# port: 21050
# database: default
# user: impala
# password:
# auth_mech: 0

firebirdFields = [
  ['Database', 'dbname', 'text', false, true]
  ['Username', 'user', 'text', false, true]
  ['Password', '#password', 'password', true, true]
]

oracleFields = [
  ['Host Name', 'host', 'text', false, true]
  ['Port', 'port', 'number', false, true]
  ['Username', 'user', 'text', false, true]
  ['Password', '#password', 'password', true, true]
  ['Service Name/SID', 'database', 'text', false, true]
]

snowflakeFields = [
  ['Host Name', 'host', 'text', false, true]
  ['Port', 'port', 'number', false, true]
  ['Username', 'user', 'text', false, true]
  ['Password', '#password', 'password', true, true]
  ['Database', 'database', 'text', false, true]
  ['Schema', 'schema', 'text', false, true]
  ['Warehouse', 'warehouse', 'text', false, false]
]

COMPONENTS_FIELDS = {
  'keboola.ex-db-pgsql': defaultFields
  'keboola.ex-db-redshift': defaultFields
  'keboola.ex-db-db2': defaultFields
  'keboola.ex-db-firebird': firebirdFields
  'keboola.ex-db-impala': defaultFields
  'keboola.ex-db-oracle': oracleFields
  'keboola.ex-mongodb': defaultFields
  'keboola.ex-db-snowflake': snowflakeFields
}


getFields = (componentId) ->
  return COMPONENTS_FIELDS[componentId] or defaultFields

module.exports =
  getFields: getFields

  # returns @array of properties that needs to be hashed
  # should return only password property in most cases
  getProtectedProperties: (componentId) ->
    result = []
    fields = getFields(componentId)
    for f in fields
      isProtected = f[3]
      propName = f[1]
      if isProtected
        result.push(propName)
    return result

# returns @array of properties that cannot be empty
  getRequiredProperties: (componentId) ->
    result = []
    fields = getFields(componentId)
    for f in fields
      isRequired = f[4]
      propName = f[1]
      if isRequired
        result.push(propName)
    return result

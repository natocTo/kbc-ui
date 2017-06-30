StorageService = require '../components/StorageActionCreators'
SapiStorage = require '../components/stores/StorageTokensStore'
Promise = require 'bluebird'
wrDbProvStore = require '../provisioning/stores/WrDbCredentialsStore'
provisioningActions = require '../provisioning/ActionCreators'
_ = require 'underscore'
OLD_WR_REDSHIFT_COMPONENT_ID = 'wr-db-redshift'
NEW_WR_REDSHIFT_COMPONENT_ID = 'keboola.wr-redshift-v2'
WR_SNOWFLAKE_COMPONENT_ID = 'keboola.wr-db-snowflake'


getDriverAndPermission = (driverParam, permissionParam, componentId) ->
  driver = driverParam
  permission = permissionParam
  if driver == 'mysql'
    driver = 'wrdb'
  if componentId == OLD_WR_REDSHIFT_COMPONENT_ID
    driver = 'redshift'
  if componentId == NEW_WR_REDSHIFT_COMPONENT_ID
    driver = 'redshift-workspace'
    permission = 'writer'
  if componentId == WR_SNOWFLAKE_COMPONENT_ID
    driver = 'snowflake'
    permission = 'writer'
  driver: driver
  permission: permission

# load credentials and if they dont exists then create new
loadCredentials = (permission, token, driver, forceRecreate, componentId) ->
  tmp = getDriverAndPermission(driver, permission, componentId)
  driver = tmp.driver
  permission = tmp.permission
  provisioningActions.loadWrDbCredentials(permission, token, driver).then ->
    creds = wrDbProvStore.getCredentials(permission, token)
    if creds and not forceRecreate
      return creds
    else
      return provisioningActions.createWrDbCredentials(permission, token, driver).then ->
        return wrDbProvStore.getCredentials(permission, token)


getWrDbToken = (desc, legacyDesc) ->
  StorageService.loadTokens().then ->
    tokens = SapiStorage.getAll()
    wrDbToken = tokens.find( (token) ->
      token.get('description') in [desc, legacyDesc]
      )
    return wrDbToken

retrieveProvisioningCredentials = (isReadOnly, wrDbToken, driver, componentId) ->
  switch driver
    when 'redshift'
      loadPromise = loadCredentials('write', wrDbToken, driver, false, componentId)
      return Promise.props
        read: loadPromise
        write: if isReadOnly then null else loadPromise
    when 'snowflake'
      loadPromise = loadCredentials('write', wrDbToken, driver, false, componentId)
      return Promise.props
        read: loadPromise
        write: if isReadOnly then null else loadPromise
    else
      return Promise.props
        read: loadCredentials('read', wrDbToken, driver, false, componentId)
        write: if not isReadOnly then loadCredentials('write', wrDbToken, driver, false, componentId)

_dropCredentials = (driver, permission, token, configHasCredentials) ->
  if configHasCredentials && wrDbProvStore.getCredentials(permission, token)
    provisioningActions.dropWrDbCredentials(permission, token, driver)

clearCredentials = (componentId, driver, token, configCredentials) ->
  hasReadCredentials = configCredentials && configCredentials.get('read', null)
  hasWriteCredentials = configCredentials && configCredentials.get('write', null)
  readTypes = getDriverAndPermission(driver, 'read', componentId)
  writeTypes = getDriverAndPermission(driver, 'write', componentId)
  writePromise = _dropCredentials(writeTypes.driver, writeTypes.permission, token, hasWriteCredentials)
  readPromise = null
  if readTypes.driver != writeTypes.driver || readTypes.permission != writeTypes.permission || !hasWriteCredentials
    readPromise = _dropCredentials(readTypes.driver, readTypes.permission, token, hasReadCredentials)
  Promise.props
    read: readPromise
    write: writePromise


module.exports =
  isProvisioningCredentials: (driver, credentials) ->
    host = credentials?.get('host')
    if driver == 'mysql'
      return host == 'wr-db-aws.keboola.com'
    if driver == 'redshift'
      return _.str.include(host,'redshift.amazonaws.com') and _.str.include(host, 'sapi')
    if driver == 'snowflake'
      return _.str.include(host,'keboola.snowflakecomputing.com')
    return false

  getCredentials: (isReadOnly, driver, componentId, configId) ->
    desc = "wrdb#{driver}_#{configId}"
    legacyDesc = "wrdb#{driver}"
    wrDbToken = null
    getWrDbToken(desc, legacyDesc).then (token) ->
      wrDbToken = token
      if not wrDbToken
        params =
          description: desc
          canManageBuckets: 1
        StorageService.createToken(params).then ->
          tokens = SapiStorage.getAll()
          wrDbToken = tokens.find( (token) ->
            token.get('description') == desc
            )
          wrDbToken = wrDbToken.get 'token'
          retrieveProvisioningCredentials(isReadOnly, wrDbToken, driver, componentId)
      else #token exists
        wrDbToken = wrDbToken.get 'token'
        retrieveProvisioningCredentials(isReadOnly, wrDbToken, driver, componentId)

  clearAll: (componentId, configId, driver, currentCredentials) ->
    desc = "wrdb#{driver}_#{configId}"
    legacyDesc = "wrdb#{driver}"
    getWrDbToken(desc, legacyDesc).then (token) ->
      if not token
        return
      tokenStr = token.get('token')
      clearCredentials(componentId, driver, tokenStr, currentCredentials)
        .then ->
          return StorageService.deleteToken(token)

Immutable = require('immutable')
StoreUtils = require('../../../utils/StoreUtils')
Constants = require('../Constants')
Dispatcher = require '../../../Dispatcher'
_ = require('underscore')
date = require '../../../utils/date'


Map = Immutable.Map

_store = Map(
  credentials: Map()
  pendingActions: Map()
  touch: null
  isLoading: false
  isLoaded: false
  isExtending: false
)

MySqlSandboxCredentialsStore = StoreUtils.createStore
  getCredentials: ->
    _store.get 'credentials'

  getValidUntil: ->
    validUntil = (_store.get('touch') + 3600 * 24 * 14) * 1000
    return validUntil

  hasCredentials: ->
    !!_store.getIn ['credentials', 'id']

  getPendingActions: ->
    _store.get 'pendingActions'

  getIsLoading: ->
    _store.get 'isLoading'

  getIsLoaded: ->
    _store.get 'isLoaded'

Dispatcher.register (payload) ->
  action = payload.action
  switch action.type
    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_LOAD
      _store = _store.set 'isLoading', true
      _store = _store.set 'isLoaded', false
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_LOAD_SUCCESS
      credentials = Immutable.fromJS(action.credentials)
      _store = _store.set 'credentials', credentials
      _store = _store.set 'touch', action.touch
      _store = _store.set 'isLoaded', true
      _store = _store.set 'isLoading', false
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_LOAD_ERROR
      _store = _store.set 'isLoading', false
      _store = _store.set 'isLoaded', true
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_CREATE
      _store = _store.setIn ['pendingActions', 'create'], true
      _store = _store.set 'isLoading', true
      _store = _store.set 'isLoaded', false
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_CREATE_SUCCESS
      credentials = Immutable.fromJS(action.credentials)
      _store = _store.set 'credentials', credentials
      _store = _store.set 'touch', action.touch
      _store = _store.setIn ['pendingActions', 'create'], false
      _store = _store.set 'isLoading', false
      _store = _store.set 'isLoaded', true
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_CREATE_ERROR
      _store = _store.setIn ['pendingActions', 'create'], false
      _store = _store.set 'isLoading', false
      _store = _store.set 'isLoaded', false
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_DROP
      _store = _store.setIn ['pendingActions', 'drop'], true
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_DROP_SUCCESS
      _store = _store.set('credentials', Map())
      _store = _store.set 'touch', null
      _store = _store.setIn ['pendingActions', 'drop'], false
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_DROP_ERROR
      _store = _store.setIn ['pendingActions', 'drop'], false
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_EXTEND
      _store = _store.setIn ['pendingActions', 'extend'], true
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_EXTEND_SUCCESS
      _store = _store.set 'touch', action.touch
      _store = _store.setIn ['pendingActions', 'extend'], false
      MySqlSandboxCredentialsStore.emitChange()

    when Constants.ActionTypes.CREDENTIALS_MYSQL_SANDBOX_EXTEND_ERROR
      _store = _store.setIn ['pendingActions', 'extend'], false
      MySqlSandboxCredentialsStore.emitChange()


module.exports = MySqlSandboxCredentialsStore

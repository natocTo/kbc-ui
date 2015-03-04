dispatcher = require '../../Dispatcher'
Constants = require('./exGanalConstants')
Promise = require('bluebird')
exGanalApi = require './exGanalApi'
exGanalStore = require './exGanalStore'

module.exports =
  loadConfiguration: (configId) ->
    if exGanalStore.hasConfig(configId)
      return Promise.resolve()
    @loadConfigurationForce(configId)

  loadConfigurationForce: (configId) ->
    exGanalApi.getConfig(configId).then (result) ->
      dispatcher.handleViewAction
        type: Constants.ActionTypes.EX_GANAL_CONFIGURATION_LOAD_SUCCEES
        configId: configId
        data: result

  changeNewQuery: (configId, newQuery) ->
    dispatcher.handleViewAction
      type: Constants.ActionTypes.EX_GANAL_CHANGE_NEW_QUERY
      configId: configId
      newQuery: newQuery

  resetNewQuery: (configId) ->
    dispatcher.handleViewAction
      type: Constants.ActionTypes.EX_GANAL_NEW_QUERY_RESET
      configId: configId

  createQuery: (configId) ->
    dispatcher.handleViewAction
      type: Constants.ActionTypes.EX_GANAL_NEW_QUERY_CREATE_START
      configId: configId
    config = exGanalStore.getConfigToSave(configId)
    exGanalApi.postConfig(configId, config.toJS()).then (result) ->
      dispatcher.handleViewAction
        type: Constants.ActionTypes.EX_GANAL_NEW_QUERY_CREATE_SUCCESS
        configId: configId
        newConfig: result

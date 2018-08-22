Immutable = require('immutable')
StoreUtils = require('../../../utils/StoreUtils')
Constants = require('../Constants')
Dispatcher = require '../../../Dispatcher'


{Map, List, Record} = Immutable

JobsRecord = Record
  isLoaded: false
  isLoading: true
  jobs: List()

_store = Map()



JobsStore = StoreUtils.createStore
  getJobs: (componentId, configurationId) ->
    _store.getIn [componentId, configurationId], new JobsRecord()

  getRowJobs: (componentId, configurationId, rowId) ->
    configJobs = _store.getIn [componentId, configurationId], new JobsRecord()
    configJobs.set('jobs', configJobs.get('jobs').filter((job) ->
      if (job.getIn(['params', 'row']) == rowId)
        return true
      return false
    ))

  getTransformationJobs: (configurationId, rowId) ->
    configJobs = _store.getIn ['transformation', configurationId], new JobsRecord()
    configJobs.set('jobs', configJobs.get('jobs').filter((job) ->
      if (job.getIn(['params', 'transformations', 0]) == rowId)
        return true
      return false
    ))

Dispatcher.register (payload) ->
  action = payload.action

  switch action.type
    when Constants.ActionTypes.JOBS_LATEST_LOAD_START
      _store = _store.updateIn [
        action.componentId
        action.configurationId
      ], new JobsRecord(),
        (jobs) ->
          jobs.set 'isLoading', true
      JobsStore.emitChange()

    when Constants.ActionTypes.JOBS_LATEST_LOAD_ERROR
      _store = _store.setIn [
        action.componentId
        action.configurationId
        'isLoading'
      ], false
      JobsStore.emitChange()

    when Constants.ActionTypes.JOBS_LATEST_LOAD_SUCCESS
      _store = _store.withMutations (store) ->
        store
        .setIn [
          action.componentId
          action.configurationId
        ], Map(
          isLoading: false
          isLoaded: true
          jobs: Immutable.fromJS action.jobs
        )
      JobsStore.emitChange()

module.exports = JobsStore

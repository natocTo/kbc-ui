Dispatcher = require '../../../Dispatcher'
Immutable = require('immutable')
{Map, List} = Immutable
Constants = require '../Constants'
fuzzy = require 'fuzzy'
StoreUtils = require '../../../utils/StoreUtils'

_store = Map(
  jobsByOrchestrationId: Map()
  editing: Map() # [jobId][tasks] - edit value
  loadingOrchestrationJobs: List()
  loadingJobs: List()
  terminatingJobs: List()
  retryingJobs: List()
)

addToLoadingOrchestrations = (store, orchestrationId) ->
  store.update 'loadingOrchestrationJobs', (loadingOrchestrationJobs) ->
    loadingOrchestrationJobs.push orchestrationId

removeFromLoadingOrchestrations = (store, orchestrationId) ->
  store.update 'loadingOrchestrationJobs', (loadingOrchestrationJobs) ->
    loadingOrchestrationJobs.remove(loadingOrchestrationJobs.indexOf(orchestrationId))

addToLoadingJobs = (store, jobId) ->
  store.update 'loadingJobs', (loadingOrchestrationJobs) ->
    loadingOrchestrationJobs.push jobId

removeFromLoadingJobs = (store, jobId) ->
  store.update 'loadingJobs', (loadingJobs) ->
    loadingJobs.remove(loadingJobs.indexOf(jobId))

addToTerminatingJobs = (store, jobId) ->
  store.update 'terminatingJobs', (jobs) ->
    jobs.push jobId

removeFromTerminatingJobs = (store, jobId) ->
  store.update 'terminatingJobs', (jobs) ->
    jobs.remove(jobs.indexOf(jobId))

setOrchestrationJob = (store, orchestrationId, job) ->
  jobId = job.get 'id'
  store.updateIn(['jobsByOrchestrationId', orchestrationId], List(), (jobs) ->
    jobs
    .filter((job) -> job.get('id') != jobId)
    .push job
  )

OrchestrationJobsStore = StoreUtils.createStore

  ###
    Returns all jobs for orchestration sorted by id desc
  ###
  getOrchestrationJobs: (idOrchestration) ->
    _store
      .getIn(['jobsByOrchestrationId', idOrchestration], List())
      .sortBy((job) -> -1 * job.get 'id')

  ###
    Check if store contains job for specifed orchestration
  ###
  hasOrchestrationJobs: (idOrchestration) ->
    _store.get('jobsByOrchestrationId').has idOrchestration

  ###
    Returns one job by it's id
  ###
  getJob: (id) ->
    foundJob = null
    _store.get('jobsByOrchestrationId').find (jobs) ->
      foundJob = jobs.find (job) -> job.get('id') == id
    foundJob

  getIsJobTerminating: (id) ->
    _store.get('terminatingJobs').contains id

  getIsJobRetrying: (id) ->
    _store.get('retryingJobs').contains id

  ###
    Test if job is currently being loaded
  ###
  isJobLoading: (idJob) ->
    _store.get('loadingJobs').contains idJob

  ###
    Test if specified orchestration jobs are currently being loaded
  ###
  isLoading: (idOrchestration) ->
    _store.get('loadingOrchestrationJobs').contains idOrchestration

  getEditingValue: (jobId, field) ->
    _store.getIn ['editing', jobId, field]

Dispatcher.register (payload) ->
  action = payload.action

  switch action.type

    when Constants.ActionTypes.ORCHESTRATION_JOBS_LOAD
      _store = addToLoadingOrchestrations(_store, action.orchestrationId)
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOBS_LOAD_ERROR
      _store = removeFromLoadingOrchestrations(_store, action.orchestrationId)
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOBS_LOAD_SUCCESS
      _store = _store.withMutations((store) ->
        removeFromLoadingOrchestrations(store, action.orchestrationId)
        .update('jobsByOrchestrationId', (jobsByOrchestrationId) ->
          jobs = jobsByOrchestrationId.get(action.orchestrationId, List())
          #append new jobs preserving already existing ones in the
          # orchestration jobs
          for newJob in action.jobs
            jobs = jobs.filter (filterJob) ->
              filterJob.get('id') != newJob.id
            jobs = jobs.push Immutable.fromJS(newJob)
          #set the new result jobs
          jobsByOrchestrationId.set(action.orchestrationId, jobs)
        )
      )
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOB_LOAD
      _store = addToLoadingJobs(_store, action.jobId)
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOB_LOAD_SUCCESS

      _store = _store.withMutations((store) ->
        store = removeFromLoadingJobs(store, action.job.id)
        setOrchestrationJob(store, action.job.orchestrationId, Immutable.fromJS(action.job))
      )
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOB_TERMINATE_START
      _store = addToTerminatingJobs _store, action.jobId
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOB_TERMINATE_ERROR, \
        Constants.ActionTypes.ORCHESTRATION_JOB_TERMINATE_SUCCESS

      _store = removeFromTerminatingJobs _store, action.jobId
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOB_RETRY_EDIT_START
      _store = _store.setIn ['editing', action.jobId, 'tasks'],
        OrchestrationJobsStore.getJob(action.jobId).get('tasks')
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOB_RETRY_EDIT_UPDATE
      _store = _store.setIn ['editing', action.jobId, 'tasks'], action.tasks
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOB_RETRY_START
      _store = _store.update 'retryingJobs', (jobs) ->
        jobs.push action.jobId
      OrchestrationJobsStore.emitChange()

    when Constants.ActionTypes.ORCHESTRATION_JOB_RETRY_SUCCESS, Constants.ActionTypes.ORCHESTRATION_JOB_RETRY_ERROR
      _store = _store.update 'retryingJobs', (jobs) ->
        jobs.remove(jobs.indexOf(action.jobId))
      OrchestrationJobsStore.emitChange()

module.exports = OrchestrationJobsStore

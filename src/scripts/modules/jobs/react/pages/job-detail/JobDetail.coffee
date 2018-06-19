React = require('react')
SoundNotifications = require '../../../../../utils/SoundNotifications'
createStoreMixin = require '../../../../../react/mixins/createStoreMixin'
RoutesStore = require '../../../../../stores/RoutesStore'
ApplicationStore = require '../../../../../stores/ApplicationStore'
JobsStore = require('../../../stores/JobsStore')
ComponentsStore  = require('../../../../components/stores/ComponentsStore')
InstalledComponentsStore = require '../../../../components/stores/InstalledComponentsStore'
PureRendererMixin = require '../../../../../react/mixins/ImmutableRendererMixin'
{fromJS} = require 'immutable'

Events = React.createFactory(require('../../../../sapi-events/react/Events').default)
ComponentName = React.createFactory(require('../../../../../react/common/ComponentName').default)
ComponentIcon = React.createFactory(require('../../../../../react/common/ComponentIcon').default)
Duration = React.createFactory(require('../../../../../react/common/Duration'))
JobRunId = React.createFactory(require('../../../../../react/common/JobRunId').default)
JobStatsContainer = require('./JobStatsContainer').default
GoodDataStatsContainer = require('./GoodDataStatsContainer')
{PanelGroup, Panel} = require 'react-bootstrap'
Link = React.createFactory require('react-router').Link
getComponentId = require('../../../getJobComponentId').default
JobStatusLabel = React.createFactory(require('../../../../../react/common/common').JobStatusLabel)
ActionCreators = require '../../../ActionCreators'

ComponentConfigurationLink = require '../../../../components/react/components/ComponentConfigurationLink'
ComponentConfigurationRowLink = React.createFactory(
  require('../../../../components/react/components/ComponentConfigurationRowLink')
)
ErrorNote = require('./ErrorNote').default

contactSupport = require('../../../../../utils/contactSupport').default

date = require '../../../../../utils/date'
{Tree, NewLineToBr} = require '@keboola/indigo-ui'
{strong,div, h2, span, h4, section, p, pre, code, br, blockquote, small} = React.DOM

APPLICATION_ERROR = 'application'

accordionHeader = (text, isActive) ->
  span null,
    span className: 'table',
      span className: 'tbody',
        span className: 'tr',
            span className: 'td',
              h4  null,
                if isActive
                  span className: 'fa fa-fw fa-angle-down'
                else
                  span className: 'fa fa-fw fa-angle-right'
                text

module.exports = React.createClass
  mixins: [createStoreMixin(JobsStore, InstalledComponentsStore), PureRendererMixin]
  displayName: "JobDetail"

  getStateFromStores: ->
    job = JobsStore.get(RoutesStore.getCurrentRouteIntParam('jobId'))

    configuration = new Map()
    if job and job.hasIn ['params', 'config']
      config = job.getIn ['params', 'config']
      configuration = InstalledComponentsStore.getConfig(getComponentId(job), config?.toString())

    job: job
    query: JobsStore.getQuery()
    configuration: configuration
    canUpdateErrorNote: ApplicationStore.getKbcVars().get('canDoSupport')

  getInitialState: ->
    job = JobsStore.get RoutesStore.getCurrentRouteIntParam('jobId')
    activeAccordion = 'stats'
    if job.get('component') == 'gooddata-writer'
      activeAccordion = 'gdresults'
    activeAccordion: activeAccordion

  componentDidUpdate: (prevProps, prevState) ->
    if not @state.job
      return
    currentStatus = @state.job.get 'status'
    prevStatus = prevState.job.get 'status'
    return if currentStatus == prevStatus
    switch currentStatus
      when 'success'
        SoundNotifications.success()
      when 'error', 'cancelled', 'canceled', 'terminated'
        SoundNotifications.crash()

  componentWillReceiveProps: ->
    @setState(@getStateFromStores())

  _handleChangeActiveAccordion: (activeKey) ->
    @setState
      activeAccordion: if activeKey == @state.activeAccordion then '' else activeKey

  render: ->
    job = @state.job
    if @state.job
      div {className: 'container-fluid'},
        div {className: 'kbc-main-content'},
          @_renderGeneralInfoRow(job)
          @_renderRunInfoRow(job)
          @_renderErrorResultRow(job) if job.get('status') == 'error'
          @_renderAccordion(job)
          @_renderLogRow(job)
    else
      null


  _renderErrorDetails: (job) ->
    exceptionId = job.getIn ['result', 'exceptionId']
    parts = []
    componentId = getComponentId(job)
    if job.get('error') == APPLICATION_ERROR
      message = 'Internal Error'
    else
      message =  job.getIn ['result', 'message']

    if job.hasIn(['result', 'context', 'rowId']) and
    job.hasIn(['result', 'context', 'queryNumber']) and
    job.hasIn(['result', 'context', 'query'])
      message = job.getIn(['result', 'message'])
      if message.match(/Executing query #(\d*) failed:/)
        matches = message.match(/Executing query #(\d*) failed:/)
        message = message.substr(matches.index + matches[0].length)
      parts.push(
        p {key: 'transformationlink'},
          'Transformation '
          ComponentConfigurationRowLink
            componentId: componentId
            configId: @state.configuration.get 'id'
            rowId: job.getIn(['result', 'context', 'rowId']).toString()
          ,
            job.getIn(['result', 'context', 'rowName'])
          ' has failed'
        )
      parts.push(
        p {key: 'transformationerror', style: {marginTop: "10px"}},
          strong null,
            'Error'
          div {style: {marginTop: "5px"}},
            React.createElement NewLineToBr,
              text: message
      )
      parts.push(
        p {key: 'transformationqueryheadline', style: {marginTop: "10px"}},
          strong null,
            'Query '
            small null,
              ComponentConfigurationRowLink
                componentId: componentId
                configId: @state.configuration.get 'id'
                rowId: job.getIn(['result', 'context', 'rowId']).toString()
                query: {highlightQueryNumber: job.getIn(['result', 'context', 'queryNumber'])}
              ,
                span null,
                  'Open query'
          div {style: {marginTop: "5px"}},
            pre null,
              code null,
                React.createElement NewLineToBr,
                  text: job.getIn(['result', 'context', 'query'])

      )
    else
      parts.push(
        p {key: "genericerrordesc"},
          React.DOM.strong null,
            React.createElement NewLineToBr,
              text: message
      )
      if job.get('error') == job.get('error') == APPLICATION_ERROR
        parts.push (
          p {key: "apperror"},
            'Something is broken. '
            'Our developers were notified about this error and will let you know what went wrong.'
        )

    parts.push (
      p {key: "exceptionId", style: {marginTop: "10px"}},
        if exceptionId
          span null, 'ExceptionId ' + exceptionId
    )

    parts.push(
      div {key: 'errornote', style: {marginTop: "10px"}},
        React.createElement ErrorNote,
          jobId: job.get('id')
          errorNote: job.get('errorNote')
          onSave: @_handleErrorNoteSave
          canEdit: @state.canUpdateErrorNote
          key: 'errornote'
    )
    parts.push(
      React.DOM.button
        className: 'btn btn-danger'
        onClick: @_contactSupport
        style:
          marginTop: '10px'
      ,
        'Contact Support'
    )
    parts

  _renderErrorResultRow: (job) ->
    div {className: 'row row-alert'},
      div {className: 'alert alert-danger', style: {
        marginBottom: 0
        paddingLeft: "50px"
        paddingTop: "20px"
        paddingBottom: "20px"
      }},
        @_renderErrorDetails(job)

  _renderRunInfoRow: (job) ->
    componentId = getComponentId(job)
    component = ComponentsStore.getComponent(componentId)
    component = ComponentsStore.unknownComponent(componentId) if !component
    if @state.configuration.size != 0
      configurationLink = span null,
        React.createElement ComponentConfigurationLink,
          componentId: componentId
          configId: @state.configuration.get 'id'
        ,
          @state.configuration.get 'name'
    else
      configurationLink = 'N/A'
    jobStarted = ->
      job.get('startTime')
    renderDate = (pdate) ->
      if pdate
        date.format(pdate)
      else
        'N/A'

    div {className: 'table kbc-table-border-vertical kbc-detail-table', style: {marginBottom: 0}},
      div {className: 'tr'},
        div {className: 'td'},
          div {className: 'row'},
            span {className: 'col-md-3'},
              'Component'
            strong {className: 'col-md-9'},
              ComponentIcon {component: component, size: "32"}
              ' '
              ComponentName {component: component}
              ' '
          div {className: 'row'},
            span {className: 'col-md-3'},
              'Configuration'
            strong {className: 'col-md-9'},
              configurationLink
              @._renderConfigVersion(job)
          div {className: 'row'},
            span {className: 'col-md-3'},
              'Created At'
            strong {className: 'col-md-9'},
              date.format(job.get('createdTime'))
          div {className: 'row'},
            span {className: 'col-md-3'},
              'Start'
            strong {className: 'col-md-9'},
              renderDate(job.get('startTime'))
        div {className: 'td'},
          div className: 'row',
            span className: 'col-md-3', 'Status '
            span className: 'col-md-9', JobStatusLabel status: job.get('status')
          div className: 'row',
            span className: 'col-md-3', 'Created By '
            strong className: 'col-md-9', job.getIn(['token', 'description'])
          div className: 'row',
            span className: 'col-md-3', 'End '
            strong className: 'col-md-9', renderDate(job.get('endTime'))
          div {className: 'row'},
            span {className: 'col-md-3'},
              'Duration'
            strong {className: 'col-md-9'},
              if jobStarted()
                Duration({startTime: job.get('startTime'), endTime: job.get('endTime')})
              else
                'N/A'

  _renderConfigVersion: (job) ->
    configVersion = job.getIn(['result', 'configVersion'], null)
    if configVersion != null
      ' - Version #' + configVersion

  _renderAccordion: (job) ->
    isTransformation = job.get('component') == 'transformation'
    React.createElement PanelGroup,
      accordion: true
      className: 'kbc-accordion kbc-panel-heading-with-table'
      activeKey: @state.activeAccordion
      onSelect: @_handleChangeActiveAccordion
    ,
      if @_isGoodDataWriter()
        React.createElement Panel,
          header: accordionHeader('Tasks', @state.activeAccordion == 'gdresults')
          eventKey: 'gdresults'
        ,
        React.createElement GoodDataStatsContainer, {job: @state.job}

      React.createElement Panel,
        header: accordionHeader('Parameters & Results', @state.activeAccordion == 'params')
        eventKey: 'params'
      ,
        @_renderParamsRow(job)

      React.createElement Panel,
        header: accordionHeader((if isTransformation then 'Mapping' else 'Storage Stats'),
          @state.activeAccordion == 'stats')
        eventKey: 'stats'
      ,
        React.createElement JobStatsContainer,
          runId: job.get 'runId'
          autoRefresh: !job.get('endTime')
          mode: if isTransformation then 'transformation' else 'default'
          jobMetrics: (if job.get('metrics') then job.get('metrics') else fromJS({}))

  _renderParamsRow: (job) ->
    status = job.get 'status'
    result = job.get 'result'
    exceptionId = job.getIn ['result', 'exceptionId'] if result
    message =  job.getIn ['result', 'message'] if result
    div null,
      div {className: 'col-md-6', style: {'wordWrap': 'break-word'}},
        h4 null, 'Params '
        React.createElement Tree, {data: job.get('params')}
      div {className: 'col-md-6'},
        h4 null,'Results '
        if status == 'error'
          div {className: 'alert alert-danger'},
            if exceptionId
              span null, 'ExceptionId ' + exceptionId
            p null, message
        else
          React.createElement Tree, {data: result} if result


  _renderGeneralInfoRow: (job) ->
    div {className: 'row'},
      div {className: 'col-md-6'},
        span {className: 'entity-name'},
          'Job '
          JobRunId {runId: job.get('runId')}

  _renderLogRow: (job) ->
    div null,
      div className: 'form-group',
        div className: 'col-xs-12',
          h2 null, 'Log'
      Events
        link:
          to: 'jobDetail'
          params:
            jobId: @state.job.get('id')
          query:
            q: @state.query
        params:
          runId: job.get('runId')
        autoReload: true

  _isGoodDataWriter: ->
    getComponentId(@state.job) == 'gooddata-writer'

  _contactSupport: ->
    contactSupport(
      subject: "Help with job #{@state.job.get('id')}"
      type: "direct"
    )

  _handleErrorNoteSave: (errorNote) ->
    ActionCreators.jobErrorNoteUpdated(@state.job.get('id'), errorNote)

React = require 'react'
Immutable = require 'immutable'
classnames = require 'classnames'
{Map} = Immutable

createStoreMixin = require '../../../../../react/mixins/createStoreMixin'

storeProvisioning = require '../../../storeProvisioning'
RoutesStore = require '../../../../../stores/RoutesStore'
LatestJobsStore = require '../../../../jobs/stores/LatestJobsStore'

QueryTable = React.createFactory(require('./QueryTable').default)
ComponentDescription = require '../../../../components/react/components/ComponentDescription'
ComponentMetadata = require '../../../../components/react/components/ComponentMetadata'

DeleteConfigurationButton = require '../../../../components/react/components/DeleteConfigurationButton'

LatestJobs = React.createFactory(require '../../../../components/react/components/SidebarJobs')
RunExtractionButton = React.createFactory(require '../../../../components/react/components/RunComponentButton')
Link = React.createFactory(require('react-router').Link)
SearchBar = require('@keboola/indigo-ui').SearchBar
actionProvisioning = require '../../../actionsProvisioning'
LatestVersions = React.createFactory(require('../../../../components/react/components/SidebarVersionsWrapper').default)

CreateQueryElement = React.createFactory(require('../../components/CreateQueryElement').default)

{div, table, tbody, tr, td, ul, li, i, a, p, span, h2, p, strong, br, button} = React.DOM

module.exports = (componentId) ->
  actionCreators = actionProvisioning.createActions(componentId)
  return React.createClass
    displayName: 'ExDbIndex'
    mixins: [createStoreMixin(LatestJobsStore, storeProvisioning.componentsStore)]

    componentWillReceiveProps: ->
      @setState(@getStateFromStores())

    getStateFromStores: ->
      config = RoutesStore.getRouterState().getIn ['params', 'config']
      ExDbStore = storeProvisioning.createStore(componentId, config)
      queries = ExDbStore.getQueries()
      credentials = ExDbStore.getCredentials()

      #state
      configId: config
      pendingActions: ExDbStore.getQueriesPendingActions()
      latestJobs: LatestJobsStore.getJobs componentId, config
      hasCredentials: ExDbStore.hasValidCredentials(credentials)
      queries: queries
      queriesFilter: ExDbStore.getQueriesFilter()
      queriesFiltered: ExDbStore.getQueriesFiltered()
      hasEnabledQueries: queries.filter((query) -> query.get('enabled')).count() > 0

    _handleFilterChange: (query) ->
      actionCreators.setQueriesFilter(@state.configId, query)

    render: ->
      div className: 'container-fluid',
        @renderMainContent()
        @renderSidebar()

    renderMainContent: ->
      div className: 'col-md-9 kbc-main-content',
        div className: 'kbc-inner-padding kbc-inner-padding-with-bottom-border',
          React.createElement ComponentDescription,
            componentId: componentId
            configId: @state.configId

        if !@state.hasCredentials
          div className: 'row component-empty-state text-center',
            p null,
              'Please setup database credentials for this extractor.'
            Link
              to: 'ex-mongodb-credentials'
              params:
                config: @state.configId
            ,
              button className: 'btn btn-success',
                'Setup Database Credentials'

        if @state.queries.count() > 1
          div className: 'row',
            div className: 'col-xs-12',
              React.createElement SearchBar,
                onChange: @_handleFilterChange
                query: @state.queriesFilter

        if @state.queries.count()
          if @state.queriesFiltered.count()
            QueryTable
              queries: @state.queriesFiltered
              configurationId: @state.configId
              componentId: componentId
              pendingActions: @state.pendingActions
              actionCreators: actionCreators
          else
            @_renderNotFound()
        else if @state.hasCredentials
          div className: 'row component-empty-state text-center',
            p null,
              'No queries configured yet.'
            CreateQueryElement
              isNav: false,
              componentId: componentId,
              configurationId: @state.configId,
              actionCreators: actionCreators

    renderSidebar: ->
      configurationId = @state.configId
      div className: 'col-md-3 kbc-main-sidebar',
        div className: 'kbc-buttons kbc-text-light',
          React.createElement ComponentMetadata,
            componentId: componentId
            configId: @state.configId

        ul className: 'nav nav-stacked',
          if @state.hasCredentials
            li null,
              Link
                to: "ex-mongodb-credentials"
                params:
                  config: @state.configId
              ,
                i className: 'fa fa-fw fa-user'
                ' Database Credentials'
          li className: classnames(disabled: !@state.hasEnabledQueries),
            RunExtractionButton
              title: 'Run Extraction'
              component: componentId
              mode: 'link'
              disabled: !@state.hasEnabledQueries
              disabledReason: 'There are no queries to be executed.'
              runParams: ->
                config: configurationId
            ,
              'You are about to run an extraction.'
          li null,
            React.createElement DeleteConfigurationButton,
              componentId: componentId
              configId: @state.configId

        LatestJobs
          limit: 3
          jobs: @state.latestJobs

        LatestVersions
          componentId: componentId
          limit: 3

    _renderNotFound: ->
      div {className: 'table table-striped'},
        div {className: 'tfoot'},
          div {className: 'tr'},
            div {className: 'td'}, 'No queries found'

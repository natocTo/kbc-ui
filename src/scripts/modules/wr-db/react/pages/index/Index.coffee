React = require 'react'
{fromJS, Map, List} = require('immutable')
_ = require 'underscore'
classnames = require 'classnames'

createStoreMixin = require '../../../../../react/mixins/createStoreMixin'

LatestJobs = require '../../../../components/react/components/SidebarJobs'
LatestJobsStore = require '../../../../jobs/stores/LatestJobsStore'

ComponentEmptyState = require('../../../../components/react/components/ComponentEmptyState').default
RunButtonModal = React.createFactory(require('../../../../components/react/components/RunComponentButton'))
Link = React.createFactory(require('react-router').Link)
TableRow = React.createFactory require('./TableRow')
TablesByBucketsPanel = React.createFactory require('../../../../components/react/components/TablesByBucketsPanel')
ComponentDescription = require '../../../../components/react/components/ComponentDescription'
ComponentDescription = React.createFactory(ComponentDescription)
ComponentMetadata = require '../../../../components/react/components/ComponentMetadata'
SearchRow = require('../../../../../react/common/SearchRow').default

LatestJobsStore = require '../../../../jobs/stores/LatestJobsStore'
RoutesStore = require '../../../../../stores/RoutesStore'
InstalledComponentsStore = require '../../../../components/stores/InstalledComponentsStore'
WrDbStore = require '../../../store'
WrDbActions = require '../../../actionCreators'
DeleteConfigurationButton = require '../../../../components/react/components/DeleteConfigurationButton'
InstalledComponentsActions = require '../../../../components/InstalledComponentsActionCreators'
StorageTablesStore = require '../../../../components/stores/StorageTablesStore'
fieldsTemplate = require '../../../templates/credentialsFields'
AddNewTableModal = require('../../../../../react/common/AddNewTableModal').default
#componentId = 'wr-db'
#driver = 'mysql'
{Button} = require 'react-bootstrap'

{p, ul, li, span, button, strong, div, i} = React.DOM

module.exports = (componentId) ->
  React.createClass templateFn(componentId)

templateFn = (componentId) ->
  displayName: 'wrdbIndex'

  mixins: [createStoreMixin(StorageTablesStore, InstalledComponentsStore, LatestJobsStore, WrDbStore)]

  getStateFromStores: ->
    configId = RoutesStore.getCurrentRouteParam('config')
    localState = InstalledComponentsStore.getLocalState(componentId, configId)
    toggles = localState.get('bucketToggles', Map())

    tables = WrDbStore.getTables(componentId, configId)
    credentials = WrDbStore.getCredentials(componentId, configId)

    #state
    latestJobs: LatestJobsStore.getJobs componentId, configId
    updatingTables: WrDbStore.getUpdatingTables(componentId, configId)
    allTables: StorageTablesStore.getAll()
    tables: tables
    credentials: credentials
    configId: configId
    hasCredentials: WrDbStore.hasCredentials(componentId, configId)
    localState: localState
    bucketToggles: toggles
    deletingTables: WrDbStore.getDeletingTables(componentId, configId)


  render: ->
    console.log 'render', @state.tables.toJS()
    div {className: 'container-fluid'},
      @_renderMainContent()
      @_renderSideBar()

  _hasTablesToExport: ->
    @state.tables.reduce((reduction, table) ->
      (table.get('export') == true) or reduction
    , false)

  _hasValidCredentials: ->
    if not @state.hasCredentials
      return false
    fields = fieldsTemplate(componentId)
    result = _.reduce(fields, (memo, field) =>
      not _.isEmpty(@state.credentials.get(field[1])) and memo
    , true)
    return result

  _renderAddNewTable: ->
    data = @state.localState.get('newTable', Map())
    selectedTableId = data.get('tableId')
    inputTables = @state.tables.toMap().mapKeys((key, c) -> c.get('id'))
    isAllConfigured = @state.allTables.filter( (t) ->
      t.getIn(['bucket', 'stage']) in ['out', 'in'] and not inputTables.has(t.get('id'))
    ).count() == 0

    updateStateFn = (path, newData) =>
      @_updateLocalState(['newTable'].concat(path), newData)

    span null,
      React.createElement Button,
        disabled: isAllConfigured
        onClick: ->
          updateStateFn(['show'], true)
        bsStyle: 'success'
      ,
        '+ Add New Table'
      React.createElement AddNewTableModal,
        show: data.get('show', false)
        allowedBuckets: ['out', 'in']
        onHideFn: =>
          @_updateLocalState([], Map())
        selectedTableId: selectedTableId
        onSetTableIdFn: (tableId) ->
          updateStateFn(['tableId'], tableId)
        configuredTables: inputTables
        onSaveFn: (tableId) =>
          WrDbActions.addTableToConfig(componentId, @state.configId, tableId).then =>
            RoutesStore.getRouter().transitionTo "#{componentId}-table",
              tableId: tableId
              config: @state.configId
        isSaving: @_isPendingTable(selectedTableId)

  _hasConfigTables: ->
    @state.tables.count() > 0

  _renderMainContent: ->
    configuredTables = @state.tables.filter (table) ->
      table.get('export')
    configuredIds = configuredTables.map((table) ->
      table.get 'id')?.toJS()
    div {className: 'col-md-9 kbc-main-content'},
      div className: 'row',
        div className: 'col-sm-8',
          ComponentDescription
            componentId: componentId
            configId: @state.configId
        div className: 'col-sm-4 kbc-buttons text-right',
          if @_hasConfigTables()
            @_renderAddNewTable()
      if @_hasValidCredentials() and @_hasConfigTables()
        React.createElement SearchRow,
          className: 'row kbc-search-row'
          onChange: @_handleSearchQueryChange
          query: @state.localState.get('searchQuery') or ''
      if @_hasValidCredentials() and @_hasConfigTables()
        TablesByBucketsPanel
          renderTableRowFn: @_renderTableRow
          renderHeaderRowFn: @_renderHeaderRow
          filterFn: @_filterBuckets
          searchQuery: @state.localState.get('searchQuery')
          isTableExportedFn: @_isTableExported
          isTableShownFn: @_isTableInConfig
          onToggleBucketFn: @_handleToggleBucket
          isBucketToggledFn: @_isBucketToggled
          configuredTableIds: configuredIds
          showAllTables: false
      else
        React.createElement ComponentEmptyState, null,
          if not @_hasValidCredentials()
            div null,
              p null, 'No credentials provided.'
              Link
                className: 'btn btn-success'
                to: "#{componentId}-credentials"
                params:
                  config: @state.configId
              ,
                i className: 'fa fa-fw fa-user'
                ' Setup Credentials First'
          else
            @_renderAddNewTable()

  _disabledToRun: ->
    if not @_hasValidCredentials()
      return 'No database credentials provided'
    if not @_hasTablesToExport()
      return 'No tables selected to export'
    return null


  _renderSideBar: ->
    div {className: 'col-md-3 kbc-main-sidebar'},
      div className: 'kbc-buttons kbc-text-light',
        React.createElement ComponentMetadata,
          componentId: componentId
          configId: @state.configId

      ul className: 'nav nav-stacked',
        if @_hasValidCredentials()
          li null,
            Link
              to: "#{componentId}-credentials"
              params:
                config: @state.configId
            ,
              i className: 'fa fa-fw fa-user'
              ' Database Credentials'
        li className: classnames(disabled: !!@_disabledToRun()),
          RunButtonModal
            disabled: !!@_disabledToRun()
            disabledReason: @_disabledToRun()
            title: "Upload tables"
            tooltip: "Upload all selected tables"
            mode: 'link'
            icon: 'fa fa-upload fa-fw'
            component: componentId
            runParams: =>
              writer: @state.configId
          ,
           "You are about to run upload of all seleted tables"
        li null,
          React.createElement DeleteConfigurationButton,
            componentId: componentId
            configId: @state.configId
      React.createElement LatestJobs,
        jobs: @state.latestJobs


  _renderTableRow: (table) ->
    #div null, table.get('id')
    TableRow
      configId: @state.configId
      tableDbName: @_getConfigTable(table.get('id')).get('name')
      isTableExported: @_isTableExported(table.get('id'))
      isPending: @_isPendingTable(table.get('id'))
      componentId: componentId
      onExportChangeFn: =>
        @_handleExportChange(table.get('id'))
      table: table
      prepareSingleUploadDataFn: @_prepareTableUploadData
      deleteTableFn: (tableId) =>
        WrDbActions.deleteTable(componentId, @state.configId, tableId)
      isDeleting: @state.deletingTables.get(table.get('id'))

  _renderHeaderRow: ->
    div className: 'tr',
      span className: 'th',
        strong null, 'Table name'
      span className: 'th',
        strong null, 'Database name'

  _handleExportChange: (tableId) ->
    isExported = @_isTableExported(tableId)
    newExportedValue = !isExported
    table = @_getConfigTable(tableId)
    dbName = tableId
    if table and table.get('name')
      dbName = table.get('name')
    WrDbActions.setTableToExport(componentId, @state.configId, tableId, dbName, newExportedValue)

  _isPendingTable: (tableId) ->
    return @state.updatingTables.has(tableId)

  _prepareTableUploadData: (table) ->
    return []

  _isTableInConfig: (tableId) ->
    @state.tables.find (t) ->
      t.get('id') == tableId

  _isTableExported: (tableId) ->
    table = @_getConfigTable(tableId)
    table and (table.get('export') == true)

  _filterBuckets: (buckets) ->
    buckets = buckets.filter (bucket) ->
      bucket.get('stage') in ['out', 'in']
    return buckets

  _handleToggleBucket: (bucketId) ->
    newValue = !@_isBucketToggled(bucketId)
    newToggles = @state.bucketToggles.set(bucketId, newValue)
    @_updateLocalState(['bucketToggles'], newToggles)

  _isBucketToggled: (bucketId) ->
    !!@state.bucketToggles.get(bucketId)


  _handleSearchQueryChange: (newQuery) ->
    @_updateLocalState(['searchQuery'], newQuery)

  _updateLocalState: (path, data) ->
    newLocalState = @state.localState.setIn(path, data)
    InstalledComponentsActions.updateLocalState(componentId, @state.configId, newLocalState)

  _getConfigTable: (tableId) ->
    @state.tables.find( (table) ->
      tableId == table.get('id')
    )

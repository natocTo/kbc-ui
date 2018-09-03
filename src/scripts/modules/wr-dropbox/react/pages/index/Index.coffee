React = require 'react'
{fromJS, Map, List} = require('immutable')
classnames = require 'classnames'
LatestJobs = require '../../../../components/react/components/SidebarJobs'
{Loader, Check} = require '@keboola/indigo-ui'
{ActivateDeactivateButton, Confirm} = require '../../../../../react/common/common'
AddNewTableModal = require('../../../../../react/common/AddNewTableModal').default
ComponentDescription = require '../../../../components/react/components/ComponentDescription'
ComponentEmptyState = require('../../../../components/react/components/ComponentEmptyState').default
ComponentDescription = React.createFactory(ComponentDescription)
SearchBar = require('@keboola/indigo-ui').SearchBar
InstalledComponentsStore = require '../../../../components/stores/InstalledComponentsStore'
StorageTablesStore = require '../../../../components/stores/StorageTablesStore'
OAuthStore = require('../../../../components/stores/OAuthStore')
InstalledComponentsActions = require '../../../../components/InstalledComponentsActionCreators'
OAuthActions = require('../../../../components/OAuthActionCreators')
createStoreMixin = require '../../../../../react/mixins/createStoreMixin'
RoutesStore = require '../../../../../stores/RoutesStore'
LatestJobsStore = require '../../../../jobs/stores/LatestJobsStore'
TablesByBucketsPanel = React.createFactory require('../../../../components/react/components/TablesByBucketsPanel')
TableRow = React.createFactory require('./TableRow')
AuthorizeModal = React.createFactory require('../../../../components/react/components/DropboxAuthorizeModal')
OptionsModal = React.createFactory require('./OptionsModal')
ComponentMetadata = require '../../../../components/react/components/ComponentMetadata'
RunButtonModal = React.createFactory(require('../../../../components/react/components/RunComponentButton'))
DeleteConfigurationButton = require '../../../../components/react/components/DeleteConfigurationButton'
InputMappingModal = require('../../../../components/react/components/generic/TableInputMappingModal').default
DeleteConfigurationButton = React.createFactory DeleteConfigurationButton
ActivateDeactivateButton = React.createFactory(ActivateDeactivateButton)
LatestVersions = React.createFactory(require('../../../../components/react/components/SidebarVersionsWrapper').default)
{p, ul, li, span, button, strong, div, i, a} = React.DOM


module.exports = (componentId) ->
  React.createClass
    displayName: 'wrDropboxIndex'
    mixins: [createStoreMixin(InstalledComponentsStore, OAuthStore, LatestJobsStore, StorageTablesStore)]

    getStateFromStores: ->
      configId = RoutesStore.getCurrentRouteParam('config')
      configData = InstalledComponentsStore.getConfigData(componentId, configId)
      localState = InstalledComponentsStore.getLocalState(componentId, configId)
      toggles = localState.get('bucketToggles', Map())
      savingData = InstalledComponentsStore.getSavingConfigData(componentId, configId)
      credentials = OAuthStore.getCredentials(componentId, configId)
      hasCredentials = OAuthStore.hasCredentials(componentId, configId)
      isDeletingCredentials = OAuthStore.isDeletingCredetials(componentId, configId)

      # state
      allTables: StorageTablesStore.getAll()
      latestJobs: LatestJobsStore.getJobs(componentId, configId)
      configId: configId
      configData: configData
      localState: localState
      bucketToggles: toggles
      savingData: savingData or Map()
      credentials: credentials
      hasCredentials: hasCredentials
      isDeletingCredentials: isDeletingCredentials

    render: ->
      div {className: 'container-fluid'},
        @_renderMainContent()
        @_renderSideBar()

    _renderAddNewTable: ->
      inputTables = @_getInputTables().toMap().mapKeys((key, c) -> c.get('source'))
      destinations = @_getInputTables().map((c) -> c.get('destination'))
      mapping = @state.localState.getIn(['newTable', 'mapping'], Map())
      tables = @state.allTables.filter( (t) ->
        isCurrentTable = t.get('id') == mapping.get('source')
        (t.getIn(['bucket', 'stage']) in ['in', 'out'] and not inputTables.has(t.get('id'))) or isCurrentTable
      )

      return React.createElement(InputMappingModal,
        mode: 'create'
        buttonBsStyle: 'success'
        buttonLabel: 'Add New Table'
        mapping: mapping
        tables: tables
        onChange: @_mappingEditingOnChangeFn
        onCancel: @_mappingEditingOnCancelFn
        onSave: @_mappingEditingOnSaveFn
        otherDestinations: destinations
        title: 'New Table'
        showFileHint: false
      )


    _renderMainContent: ->
      inputTablesIds = @_getInputTables().map((c) -> c.get('source'))
      div {className: 'col-md-9 kbc-main-content'},
        div className: 'row',
          div className: 'col-sm-8',
            ComponentDescription
              componentId: componentId
              configId: @state.configId
          if @state.hasCredentials and @_getInputTables().count() > 0
            div className: 'col-sm-4 kbc-buttons text-right',
              @_renderAddNewTable()
        if @state.hasCredentials and @_getInputTables().count() > 0
          div className: 'row',
            div className: 'col-sm-8',
              React.createElement SearchBar,
                onChange: @_handleSearchQueryChange
                query: @state.localState.get('searchQuery')
        if @state.hasCredentials and @_getInputTables().count() > 0
          TablesByBucketsPanel
            renderTableRowFn: @_renderTableRow
            renderHeaderRowFn: @_renderHeaderRow
            filterFn: @_filterBuckets
            searchQuery: @state.localState.get('searchQuery')
            isTableExportedFn: @_isTableExported
            onToggleBucketFn: @_handleToggleBucket
            isBucketToggledFn: @_isBucketToggled
            showAllTables: false
            configuredTables: inputTablesIds.toJS()
        else
          React.createElement ComponentEmptyState, null,
            if not @state.hasCredentials
              div null,
                p null, 'No Dropbox account authorized.'
                AuthorizeModal
                  configId: @state.configId
                  redirectRouterPath: 'wr-dropbox-oauth-redirect' + componentId
                  componentId: componentId
            else
              @_renderNoTables()

    _renderTableRow: (table) ->
      mapping = @_getInputTables().find (t) ->
        t.get('source') == table.get('id')

      data = @state.localState.get('newTable', Map())
      inputTables = @_getInputTables().toMap().mapKeys((key, c) -> c.get('source'))
      destinations = @_getInputTables().map((c) -> c.get('destination'))
      editTable = @_getInputTables().find((t) -> t.get('source') == data.get('oldTableId'))
      destinations = destinations.filter((d) -> d != editTable?.get('destination'))
      tables = @state.allTables.filter( (t) ->
        isCurrentTable = t.get('id') == mapping.get('source')
        (t.getIn(['bucket', 'stage']) in ['in', 'out'] and not inputTables.has(t.get('id'))) or isCurrentTable
      )

      TableRow
        componentId: componentId
        isTableExported: @_isTableExported(table.get('id'))
        isPending: @_isPendingTable(table.get('id'))
        table: table
        prepareSingleUploadDataFn: @_prepareTableUploadData
        deleteTableFn: @_removeTableExport
        mapping: mapping
        mappingFromState: @state.localState.getIn(['newTable', 'mapping'], Map())
        onEditTable: =>
          editTable = Map({oldTableId: mapping.get('source')})
          editTable = editTable.set('mapping', mapping)
          @_updateLocalState(['newTable'], editTable)
        editOnChangeFn: @_mappingEditingOnChangeFn
        editOnSaveFn: @_mappingEditingOnSaveFn
        editOnCancelFn: @_mappingEditingOnCancelFn
        tables: tables
        destinations: destinations

    _mappingEditingOnSaveFn: ->
      data = @state.localState.get('newTable')
      mapping = @state.localState.getIn(['newTable', 'mapping'])
      oldTableId = data.get('oldTableId')
      @_addTableExport(mapping, oldTableId).then =>
        @_updateLocalState(['newTable'], Map())

    _mappingEditingOnCancelFn: ->
      @_updateLocalState(['newTable'], Map())

    _mappingEditingOnChangeFn: (newMapping) ->
      @_updateLocalState(['newTable', 'mapping'], newMapping)

    _prepareTableUploadData: (table) ->
      tableId = table.get('id')
      inTable = @_getInputTables().filter (t) ->
        t.get('source') == tableId
      storage:
        input:
          tables: inTable.toJS()
      parameters: @state.configData.get('parameters', Map()).toJS()

    _isPendingTable: (tableId) ->
      isSavingData = @state.savingData.has('storage')
      if not isSavingData
        return false
      path = ['storage', 'input', 'tables']
      saving = @state.savingData.getIn(path)
      config = @state.configData.getIn(path)
      isInSaving = saving?.find (table) ->
        table.get('source') == tableId
      isInConfig = config?.find (table) ->
        table.get('source') == tableId
      statusArray = [!!isInSaving, !!isInConfig]
      true in statusArray and false in statusArray



    _renderHeaderRow: ->
      div className: 'tr',
        span className: 'th',
          strong null, 'Table name'
        span className: 'th',''
        span className: 'th',
          strong null, 'Destination'

    _canRunUpload: ->
      (@_getInputTables().count() > 0) and @state.hasCredentials


    _renderSideBar: ->
      div {className: 'col-md-3 kbc-main-sidebar'},
        div className: 'kbc-buttons kbc-text-light',
          span null,
            'Authorized for '
          strong null,
            if @state.hasCredentials
              @state.credentials.get('description')
            else
              'not authorized'

          React.createElement ComponentMetadata,
            componentId: componentId
            configId: @state.configId
        ul className: 'nav nav-stacked',
          li {className: classnames(disabled: !@_canRunUpload())},
            RunButtonModal
              title: 'Run'
              icon: 'fa fa-fw fa-play'
              mode: 'link'
              component: componentId
              disabled: !@_canRunUpload()
              disabledReason: "A Dropbox account must be authorized and a table selected."
              runParams: =>
                config: @state.configId
            ,
             "You are about to upload #{@_getInputTables().count()} selected table(s) to the Dropbox account. \
             The resulting file(s) will be stored into the 'Apps/Keboola Writer' Dropbox folder."

          li null,
            if @state.hasCredentials
              @_renderResetAuthorization()
            else
              AuthorizeModal
                configId: @state.configId
                componentId: componentId
                redirectRouterPath: 'wr-dropbox-oauth-redirect' + componentId
                renderOpenButtonAsLink: true

          li null,
            OptionsModal
              parameters: @state.configData.get('parameters', Map())
              updateParamsFn: @_updateParmeters
              isUpdating: @state.savingData.has('parameters')

          li null,
            DeleteConfigurationButton
              componentId: componentId
              configId: @state.configId
              preDeleteFn: @_deleteCredentials
        React.createElement LatestJobs,
          jobs: @state.latestJobs
          limit: 3

        LatestVersions
          componentId: componentId
          limit: 3


    _renderResetAuthorization: ->
      description = @state.credentials.get('description')
      ActivateDeactivateButton
        mode: 'link'
        activateTooltip: ''
        deactivateTooltip: 'Reset Authorization'
        isActive: true
        isPending: @state.isDeletingCredentials
        onChange: @_deleteCredentials
      React.createElement Confirm,
        text: "Do you really want to reset the authorization of #{description}? \
         The tables configured to upload will not be reset."
        title: "Reset Authorization #{description}"
        buttonLabel: 'Reset'
        onConfirm: @_deleteCredentials
        childrenRootElement: React.DOM.a
      ,
        if @state.isDeletingCredentials
          React.createElement Loader
        else
          React.DOM.span className: 'fa fa-fw fa-times'
        ' Reset Authorization'

    _renderNoTables: ->
      div null,
        p null, 'No tables configured.'
        @_renderAddNewTable()

    _deleteCredentials: ->
      OAuthActions.deleteCredentials(componentId, @state.configId)

    _updateParmeters: (newParameters) ->
      @_updateAndSaveConfigData(['parameters'], newParameters)

    _updateAndSaveConfigData: (path, data) ->
      newData = @state.configData.setIn(path, data)
      saveFn = InstalledComponentsActions.saveComponentConfigData
      saveFn(componentId, @state.configId, newData)

    _getInputTables: ->
      @state.configData.getIn(['storage', 'input', 'tables']) or List()

    _findInTable: (tableId) ->
      intables = @_getInputTables()
      intables = intables.filter (table) ->
        table.get('source') != tableId

    _removeTableExport: (tableId) ->
      intables = @_getInputTables()
      intables = intables.filter (table) ->
        table.get('source') != tableId
      @_updateAndSaveConfigData(['storage', 'input', 'tables'], intables)

    _addTableExport: (mapping, oldTableId) ->
      tableId = mapping.get('source')
      intables = @_getInputTables()
      found = false
      if oldTableId != tableId
        intables = intables.filter( (t) -> t.get('source') != oldTableId)
      intables = intables.map((table) ->
        if table.get('source') == tableId
          found = true
          return mapping
        else
          return table
      )
      if not found
        intables = intables.push mapping
      @_updateAndSaveConfigData(['storage', 'input', 'tables'], intables)


    _filterBuckets: (buckets) ->
      buckets = buckets.filter (bucket) ->
        bucket.get('stage') in ['out', 'in']
      return buckets


    _isTableExported: (tableId) ->
      intables = @_getInputTables()
      !!intables.find((table) ->
        table.get('source') == tableId)


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
      InstalledComponentsActions.updateLocalState(componentId, @state.configId, newLocalState, path)

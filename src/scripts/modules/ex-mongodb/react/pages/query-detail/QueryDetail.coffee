React = require 'react'

createStoreMixin = require '../../../../../react/mixins/createStoreMixin'

StorageTablesStore = require '../../../../components/stores/StorageTablesStore'
RoutesStore = require '../../../../../stores/RoutesStore'

QueryEditor = React.createFactory(require '../../components/QueryEditor')
QueryNav = require('./QueryNav').default
EditButtons = require '../../../../../react/common/EditButtons'
SaveButtons = require('../../../../../react/common/SaveButtons').default
constants = require './../../../constants'

{ Map, List } = require 'immutable'

{div, table, tbody, tr, td, ul, li, a, span, h2, p, strong} = React.DOM

module.exports = (componentId, actionsProvisioning, storeProvisioning) ->
  ExDbActionCreators = actionsProvisioning.createActions(componentId)
  return React.createClass
    displayName: 'ex-mongodb/QueryDetail'
    mixins: [createStoreMixin(storeProvisioning.componentsStore, StorageTablesStore)]

    componentWillReceiveProps: ->
      @setState(@getStateFromStores())

    getStateFromStores: ->
      configId = RoutesStore.getCurrentRouteParam 'config'
      queryId = RoutesStore.getCurrentRouteIntParam 'query'
      ExDbStore = storeProvisioning.createStore(componentId, configId)
      isEditing = ExDbStore.isEditingQuery(queryId)
      query = ExDbStore.getConfigQuery(queryId)
      editingQuery = if ExDbStore.isEditingQuery(queryId) then ExDbStore.getEditingQuery(queryId) else query
      isChanged = ExDbStore.isChangedQuery(queryId)
      editingQueries: ExDbStore.getEditingQueries()
      newQueries: ExDbStore.getNewQueries()
      newQueriesIdsList: ExDbStore.getNewQueriesIdsList()

      configId: configId
      query: query
      editingQuery: editingQuery
      isEditing: isEditing
      isChanged: isChanged
      isSaving: ExDbStore.isSavingQuery(queryId)
      isValid: ExDbStore.isEditingQueryValid(queryId)
      exports: StorageTablesStore.getAll()
      queriesFilter: ExDbStore.getQueriesFilter()
      queriesFiltered: ExDbStore.getQueriesFiltered()
      outTableExist: ExDbStore.outTableExist(editingQuery)
      component: storeProvisioning.componentsStore.getComponent(constants.COMPONENT_ID)

    _handleQueryChange: (newQuery) ->
      ExDbActionCreators.updateEditingQuery @state.configId, newQuery

    _handleEditStart: ->
      ExDbActionCreators.editQuery @state.configId, @state.query.get('id')

    _handleCancel: ->
      ExDbActionCreators.cancelQueryEdit @state.configId, @state.query.get('id')

    _handleReset: ->
      ExDbActionCreators.resetQueryEdit @state.configId, @state.query.get('id')

    _handleSave: ->
      ExDbActionCreators.saveQueryEdit @state.configId, @state.query.get('id')

    render: ->
      div className: 'container-fluid',
        div className: 'kbc-main-content',
          div className: 'col-md-3 kbc-main-nav',
            div className: 'kbc-container',
              React.createElement QueryNav,
                queries: @state.queriesFiltered
                configurationId: @state.configId
                filter: @state.queriesFilter
                componentId: componentId
                actionCreators: ExDbActionCreators
                navQuery: @state.editingQuery || Map()
                editingQueries: @state.editingQueries || List()
                newQueries: @state.newQueries || List()
                newQueriesIdsList: @state.newQueriesIdsList
          div className: 'col-md-9 kbc-main-content-with-nav',
            div className: 'kbc-header',
              div className: 'kbc-buttons',
                React.createElement SaveButtons,
                  isSaving: @state.isSaving
                  isChanged: @state.isChanged
                  onReset: @_handleReset
                  onSave: @_handleSave
                  disabled: @state.isSaving or !@state.isValid
            div className: 'kbc-header',
              QueryEditor
                query: @state.editingQuery
                exports: @state.exports
                onChange: @_handleQueryChange
                configId: @state.configId
                componentId: componentId
                outTableExist: @state.outTableExist
                component: @state.component

React = require('react')
Immutable = require('immutable')
fuzzy = require 'fuzzy'


TransformationBucketRow = React.createFactory(require './TransformationBucketRow')
TransformationsList = require './TransformationsList'
TransformationActionCreators = require '../../../ActionCreators'
createStoreMixin = require '../../../../../react/mixins/createStoreMixin'
TransformationBucketsStore = require('../../../stores/TransformationBucketsStore')
TransformationsStore = require('../../../stores/TransformationsStore')
InstalledComponentsStore = require('../../../../components/stores/InstalledComponentsStore')
SearchRow = require('../../../../../react/common/SearchRow').default
SplashIcon = require('../../../../../react/common/SplashIcon').default

{Panel, PanelGroup} = require('react-bootstrap')

NewTransformationBucketButton = require '../../components/NewTransformationBucketButton'

{div, span, input, strong, form, button, h4, h2, h1, i, button, small, ul, li, a, p} = React.DOM
TransformationsTrash = React.createClass
  displayName: 'TransformationsTrash'
  mixins: [createStoreMixin(TransformationBucketsStore, TransformationsStore, InstalledComponentsStore)]

  getStateFromStores: ->
    buckets: TransformationBucketsStore.getAllDeleted()
    toggles: TransformationBucketsStore.getToggles()
    pendingActions: TransformationBucketsStore.getPendingActions()
    filter: TransformationBucketsStore.getTransformationBucketsFilter()
    transformationsInBuckets: TransformationsStore.getAllTransformations()
    transformationPendingActions: TransformationsStore.getAllPendingActions()

  _handleFilterChange: (query) ->
    TransformationActionCreators.setTransformationBucketsFilter(query)

  render: ->
    if @state.buckets.count() < 1
      React.createElement SplashIcon,
        icon: 'kbc-icon-cup'
        label: 'Trash is empty'
    else
      div className: 'container-fluid',
        div className: 'kbc-main-content',
          React.createElement SearchRow,
            className: 'row kbc-search-row'
            onChange: @_handleFilterChange
            query: @state.filter
          span {},
            if @_getFilteredBuckets().count()
              div className: 'kbc-accordion kbc-panel-heading-with-table kbc-panel-heading-with-table'
              ,
                @_getFilteredBuckets().map (bucket) ->
                  @_renderBucketPanel bucket
                , @
                .toArray()
            else
              @_renderEmptyState()

  _renderEmptyState: ->
    div {className: 'kbc-search-row'},
      if @state.filter && @state.filter != ''
        h2 null,
          'No buckets found.'

  _renderBucketPanel: (bucket) ->
    header = span null,
      span className: 'table',
        TransformationBucketRow
          bucket: bucket
          transformations: TransformationsStore.getTransformations(bucket.get('id'))
          description: bucket.get('description')
          pendingActions: @state.pendingActions.get(bucket.get('id'), Immutable.Map())
          key: bucket.get 'id'

    React.createElement Panel,
      header: header
      key: bucket.get("id")
      eventKey: bucket.get("id")
      expanded: false
      collapsible: true

  _getFilteredBuckets: ->
    filtered = @state.buckets
    if @state.filter && @state.filter != ''
      filter = @state.filter
      component = @
      filtered = @state.buckets.filter (bucket) ->
        fuzzy.match(filter, bucket.get('name').toString()) or
          fuzzy.match(filter, bucket.get('id').toString()) or
          fuzzy.match(filter, bucket.get('description').toString())

    filtered = filtered.sortBy((bucket) ->
      bucket.get('name').toLowerCase()
    )
    return filtered

module.exports = TransformationsTrash

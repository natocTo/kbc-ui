React = require 'react'
ImmutableRenderMixin = require '../../../../../react/mixins/ImmutableRendererMixin'
InstalledComponentsActionCreators = require '../../../../components/InstalledComponentsActionCreators'
RunComponentButton = React.createFactory(require '../../../../components/react/components/RunComponentButton')
DeleteButton = React.createFactory(require '../../../../../react/common/DeleteButton')
TransformationActionCreators = require '../../../ActionCreators'
RoutesStore = require '../../../../../stores/RoutesStore'
{OverlayTrigger, Tooltip} = require 'react-bootstrap'
descriptionExcerpt = require('../../../../../utils/descriptionExcerpt').default
TransformationTypeLabel = React.createFactory(require '../../components/TransformationTypeLabel')

{span, div, a, button, i, h4, small, em} = React.DOM

TransformationBucketRow = React.createClass(
  displayName: 'TransformationBucketRow'
  mixins: [ImmutableRenderMixin]
  propTypes:
    bucket: React.PropTypes.object
    transformations: React.PropTypes.object
    pendingActions: React.PropTypes.object
    description: React.PropTypes.string
    legacyUI: React.PropTypes.bool

  buttons: ->
    buttons = []
    props = @props

    buttons.push(DeleteButton
      tooltip: 'Delete Transformation Bucket'
      isPending: @props.pendingActions.get 'delete'
      confirm:
        title: 'Delete Transformation Bucket'
        text: "Do you really want to delete the transformation bucket #{@props.bucket.get('name')}?"
        onConfirm: @_deleteTransformationBucket
      isEnabled: true
      key: 'delete-new'
    )

    buttons.push(RunComponentButton(
      title: "Run #{@props.bucket.get('name')}"
      component: 'transformation'
      mode: 'button'
      runParams: ->
        configBucketId: props.bucket.get('id')
      key: 'run'
      tooltip: 'Run all transformations in bucket'
    ,
      "You are about to run all transformations in the bucket #{@props.bucket.get('name')}."
    ))

    buttons.push(
      React.createElement OverlayTrigger,
        overlay: React.createElement(Tooltip, null, 'Go to Bucket Detail')
        placement: 'top'
      ,
        button
          key: 'bucket'
          className: "btn btn-link"
          onClick: (e) ->
            e.preventDefault()
            e.stopPropagation()
            RoutesStore.getRouter().transitionTo("transformationBucket", {config: props.bucket.get('id')})
        ,
          i {className: "fa fa-fw fa-chevron-right"}
    )


    buttons

  render: ->
    items = []
    items.push(
      span {className: 'td col-xs-3'},
        h4 {}, @props.bucket.get('name')
    )
    if (@props.legacyUI)
      items.push(
        span {className: 'td col-xs-6'},
          small {}, descriptionExcerpt(@props.description) || em {}, 'No description'
      )
    else
      items.push(
        span {className: 'td col-xs-2'},
          TransformationTypeLabel
            backend: @props.bucket.getIn(['configuration', 'backend'])
            type: @props.bucket.getIn(['configuration', 'type'])

      )
      items.push(
        span {className: 'td col-xs-4'},
          small {}, descriptionExcerpt(@props.description) || em {}, 'No description'
      )

    items.push(
      span {className: 'td col-xs-3 text-right kbc-no-wrap'},
        @buttons()
    )
    span {className: 'tr'},
      items

  _deleteTransformationBucket: ->
    # if transformation is deleted immediately view is rendered with missing bucket because of store changed
    bucketId = @props.bucket.get('id')
    TransformationActionCreators.deleteTransformationBucket(bucketId)
)

module.exports = TransformationBucketRow

React = require 'react'
pureRendererMixin = require '../../../../../react/mixins/ImmutableRendererMixin'
Immutable = require('immutable')

TransformationRow = React.createFactory(require '../../components/TransformationRow')
{div, span, strong} = React.DOM

module.exports = React.createClass
  displayName: 'TransformationsList'
  mixin: [pureRendererMixin]
  propTypes:
    bucket: React.PropTypes.object.isRequired
    transformations: React.PropTypes.object
    pendingActions: React.PropTypes.object
    legacyUI: React.PropTypes.bool

  render: ->
    if @props.transformations.count()
      childs = @props.transformations.map((transformation) ->
        TransformationRow
          bucket: @props.bucket
          transformation: transformation
          pendingActions: @props.pendingActions.getIn([transformation.get("id")], Immutable.Map())
          key: transformation.get 'id'
          hideButtons: true
          legacyUI: @props.legacyUI
      , @).toArray()

      div className: 'row',
        div className: 'table table-striped table-hover',
          div className: 'tbody',
            childs
    else
      div {},
        "This bucket is empty"

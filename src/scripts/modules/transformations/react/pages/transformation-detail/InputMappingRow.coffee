React = require 'react'
{ModalTrigger, OverlayTrigger, Tooltip} = require 'react-bootstrap'
DeleteButton = require '../../../../../react/common/DeleteButton'
ImmutableRenderMixin = require '../../../../../react/mixins/ImmutableRendererMixin'
TableSizeLabel = React.createFactory(require '../../components/TableSizeLabel')
TableBackendLabel = React.createFactory(require '../../components/TableBackendLabel')
TransformationTableTypeLabel = React.createFactory(require '../../components/TransformationTableTypeLabel')
InputMappingModal = require('../../modals/InputMapping').default
actionCreators = require '../../../ActionCreators'
Immutable = require 'immutable'

{span, div, a, button, i, h4, small, em, code} = React.DOM

module.exports = React.createClass(
  displayName: 'InputMappingRow'
  mixins: [ImmutableRenderMixin]

  propTypes:
    inputMapping: React.PropTypes.object.isRequired
    tables: React.PropTypes.object.isRequired
    transformation: React.PropTypes.object.isRequired
    bucket: React.PropTypes.object.isRequired
    editingId: React.PropTypes.string.isRequired
    mappingIndex: React.PropTypes.string.isRequired
    otherDestinations: React.PropTypes.object.isRequired
    definition: React.PropTypes.object

  getDefaultProps: ->
    definition: Immutable.Map()

  render: ->
    span {className: 'table'},
      span {className: 'tbody'},
        span {className: 'tr'},
          if @props.definition.has('label')
            [
              span {className: 'td col-xs-4', key: 'label'},
                @props.definition.get('label')
              span {className: 'td col-xs-1', key: 'arrow'},
                span {className: 'fa fa-chevron-right fa-fw'}
              span {className: 'td col-xs-6', key: 'destination'},
                TableSizeLabel {size: @props.tables.getIn [@props.inputMapping.get('source'), 'dataSizeBytes']}
                ' '
                TableBackendLabel {
                  backend: @props.tables.getIn [@props.inputMapping.get('source'), 'bucket', 'backend']
                }
                if @props.inputMapping.get('source') != ''
                  @props.inputMapping.get('source')
                else
                  'Not set'
              ]
          else
            [
              span {className: 'td col-xs-3', key: 'icons'},
                TableSizeLabel {size: @props.tables.getIn [@props.inputMapping.get('source'), 'dataSizeBytes']}
                ' '
                TableBackendLabel {
                  backend: @props.tables.getIn [@props.inputMapping.get('source'), 'bucket', 'backend']
                }
              span {className: 'td col-xs-4', key: 'source'},
                @props.inputMapping.get 'source', 'Not set'
              span {className: 'td col-xs-1', key: 'arrow'},
                span {className: 'fa fa-chevron-right fa-fw'}
              span {className: 'td col-xs-3', key: 'destination'},
                TransformationTableTypeLabel
                  backend: @props.transformation.get('backend')
                  type: @props.inputMapping.get('type')
                ' '
                if @props.transformation.get('backend') == 'docker'
                  'in/tables/' + @props.inputMapping.get 'destination'
                else
                  @props.inputMapping.get 'destination'
            ]
          span {className: 'td col-xs-1 text-right kbc-no-wrap'},
            if (@props.inputMapping.get('source') != '')
              React.createElement DeleteButton,
                tooltip: 'Delete Input'
                isPending: @props.pendingActions.get('delete-input-' + @props.mappingIndex)
                confirm:
                  title: 'Delete Input'
                  text: span null,
                    "Do you really want to delete the input mapping for "
                    code null,
                      @props.inputMapping.get('source')
                    "?"
                  onConfirm: @_handleDelete
            React.createElement OverlayTrigger,
              overlay: React.createElement Tooltip, null, 'Edit Input'
              placement: 'top'
            ,
              React.createElement ModalTrigger,
                modal: React.createElement InputMappingModal,
                  mode: 'edit'
                  tables: @props.tables
                  backend: @props.transformation.get("backend")
                  type: @props.transformation.get("type")
                  mapping: @props.editingInputMapping
                  otherDestinations: @props.otherDestinations
                  onChange: @_handleChange
                  onCancel: @_handleCancel
                  onSave: @_handleSave
                  definition: @props.definition
              ,
                React.DOM.button
                  className: "btn btn-link"
                  onClick: (e) ->
                    e.preventDefault()
                    e.stopPropagation()
                ,
                  React.DOM.span null,
                    React.DOM.span {className: 'fa fa-fw kbc-icon-pencil'}

  _handleChange: (newMapping) ->
    actionCreators.updateTransformationEditingField(@props.bucket.get('id'),
      @props.transformation.get('id')
      @props.editingId
      newMapping
    )

  _handleCancel: (newMapping) ->
    actionCreators.cancelTransformationEditingField(@props.bucket.get('id'),
      @props.transformation.get('id')
      @props.editingId
    )

  _handleSave: ->
    actionCreators.saveTransformationMapping(@props.bucket.get('id'),
      @props.transformation.get('id')
      'input'
      @props.editingId
      @props.mappingIndex
    )

  _handleDelete: ->
    actionCreators.deleteTransformationMapping(@props.bucket.get('id'),
      @props.transformation.get('id')
      'input'
      @props.mappingIndex
    )
)

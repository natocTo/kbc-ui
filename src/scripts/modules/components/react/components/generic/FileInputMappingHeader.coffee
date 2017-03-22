React = require 'react'
Immutable = require 'immutable'
Link = React.createFactory(require('react-router').Link)
DeleteButton = require '../../../../../react/common/DeleteButton'
ImmutableRenderMixin = require '../../../../../react/mixins/ImmutableRendererMixin'
FileInputMappingModal = require('./FileInputMappingModal').default

{span, div, a, button, i, h4, small, em, code} = React.DOM

module.exports = React.createClass(
  displayName: 'FileInputMappingHeader'
  mixins: [ImmutableRenderMixin]

  propTypes:
    value: React.PropTypes.object.isRequired
    editingValue: React.PropTypes.object.isRequired
    mappingIndex: React.PropTypes.number.isRequired
    onChange: React.PropTypes.func.isRequired
    onSave: React.PropTypes.func.isRequired
    onCancel: React.PropTypes.func.isRequired
    onDelete: React.PropTypes.func.isRequired
    pendingActions: React.PropTypes.object.isRequired
    onEditStart: React.PropTypes.func.isRequired

  render: ->
    component = @
    span {className: 'table'},
      span {className: 'tbody'},
        span {className: 'tr'},
          span {className: 'td col-xs-3'},
            if @props.value.get('tags').count()
              @props.value.get('tags').map((tag) ->
                span
                  className: "label kbc-label-rounded-small label-default"
                  key: tag
                ,
                  tag
              ).toArray()
            else
              'N/A'
          span {className: 'td col-xs-4'},
            if @props.value.get('query', '') != ''
              code null,
                @props.value.get('query')
          span {className: 'td col-xs-1'},
            span {className: 'fa fa-chevron-right fa-fw'}
          span {className: 'td col-xs-3'},
            'in/files/*'
          span {className: 'td col-xs-1 text-right kbc-no-wrap'},
            React.createElement DeleteButton,
              tooltip: 'Delete Input'
              isPending: @props.pendingActions.getIn(['input', 'files', @props.mappingIndex, 'delete'], false)
              confirm:
                title: 'Delete Input'
                text: span null,
                  "Do you really want to delete the input mapping for "
                  code null,
                    'tags: '
                    JSON.stringify(@props.value.get('tags', Immutable.List()).toJS())
                  ', '
                  code null,
                    'query: '
                    @props.value.get('query')
                  "?"
                onConfirm: @props.onDelete
            React.createElement FileInputMappingModal,
              mode: 'edit'
              mapping: @props.editingValue
              onChange: @props.onChange
              onCancel: @props.onCancel
              onSave: @props.onSave
              onEditStart: @props.onEditStart
)

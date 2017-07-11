React = require 'react'
ImmutableRenderMixin = require '../../../../../../react/mixins/ImmutableRendererMixin'
{Input} = require('./../../../../../../react/common/KbcBootstrap')
{ ListGroup, ListGroupItem } = require('react-bootstrap')
Input = React.createFactory Input
Button = React.createFactory(require('react-bootstrap').Button)
ListGroup = React.createFactory ListGroup
ListGroupItem = React.createFactory ListGroupItem
Select = React.createFactory(require('react-select'))
_ = require('underscore')
getDatatypeLabel = require('./getDatatypeLabel')

module.exports = React.createClass
  displayName: 'RedshiftDataTypesAddForm'
  mixins: [ImmutableRenderMixin]

  propTypes:
    columnValue: React.PropTypes.string.isRequired
    datatypeValue: React.PropTypes.string.isRequired
    sizeValue: React.PropTypes.string.isRequired
    compressionValue: React.PropTypes.string.isRequired
    convertEmptyValuesToNullValue: React.PropTypes.bool.isRequired

    columnsOptions: React.PropTypes.array.isRequired
    datatypeOptions: React.PropTypes.array.isRequired
    compressionOptions: React.PropTypes.array.isRequired
    disabled: React.PropTypes.bool.isRequired
    showSize: React.PropTypes.bool.isRequired

    handleAddDataType: React.PropTypes.func.isRequired
    columnOnChange: React.PropTypes.func.isRequired
    datatypeOnChange: React.PropTypes.func.isRequired
    convertEmptyValuesToNullOnChange: React.PropTypes.func.isRequired
    sizeOnChange: React.PropTypes.func.isRequired
    compressionOnChange: React.PropTypes.func.isRequired

    availableColumns: React.PropTypes.array.isRequired


  _handleSizeOnChange: (e) ->
    @props.sizeOnChange(e.target.value)


  _getDatatypeOptions: ->
    _.map(@props.datatypeOptions, (datatype) ->
      {
        label: datatype
        value: datatype
      }
    )

  _getCompressionOptions: ->
    _.map(@props.compressionOptions, (compression) ->
      {
        label: compression
        value: compression
      }
    )

  _convertEmptyValuesToNullOnChange: (e) ->
    @props.convertEmptyValuesToNullOnChange(e.target.checked)

  render: ->
    component = @
    React.DOM.div {className: "well"},
      React.DOM.div {className: "row"},
        React.DOM.span {className: "col-xs-4"},
          Select
            name: 'add-column'
            value: @props.columnValue
            disabled: @props.disabled
            placeholder: "Column"
            onChange: @props.columnOnChange
            options: @props.availableColumns
        React.DOM.span {className: "col-xs-3"},
          Select
            name: 'add-datatype'
            value: @props.datatypeValue
            disabled: @props.disabled
            placeholder: "Datatype"
            onChange: @props.datatypeOnChange
            options: @_getDatatypeOptions()
        React.DOM.span {className: "col-xs-3"},
          Input
            type: 'text'
            name: 'add-size'
            value: @props.sizeValue
            disabled: @props.disabled || !@props.showSize
            placeholder: "Length, eg. 255"
            onChange: @_handleSizeOnChange
        React.DOM.span {className: "col-xs-2"},
          Select
            name: 'add-datatype-compression'
            value: @props.compressionValue
            disabled: @props.disabled
            placeholder: "Compression"
            onChange: @props.compressionOnChange
            options: @_getCompressionOptions()
      React.DOM.div {className: "row", style: {paddingTop: "5px"}},
        React.DOM.span {className: "col-xs-6"},
          Input
            checked: @props.convertEmptyValuesToNullValue
            onChange: @_convertEmptyValuesToNullOnChange
            standalone: true
            type: 'checkbox'
            label: React.DOM.small {},
              'Convert empty values to '
              React.DOM.code null,
                'null'
        React.DOM.span {className: "col-xs-6 text-right"},
          Button
            className: "btn-info"
            onClick: @props.handleAddDataType
            disabled: @props.disabled || !@props.columnValue || !@props.datatypeValue
          ,
            React.DOM.i {className: "kbc-icon-plus"}
            " Add data type"
      React.DOM.div {className: "row", style: {paddingTop: "10px"}},
        React.DOM.div {className: "help-block col-xs-12"},
          React.DOM.small {},
            React.DOM.div {},
              React.DOM.code {}, "VARCHAR(255) ENCODE LZO"
              "default for primary key columns"
            React.DOM.div {},
              React.DOM.code {}, "VARCHAR(65535) ENCODE LZO"
              "default for all other columns"

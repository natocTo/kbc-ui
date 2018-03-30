React = require 'react'
Immutable = require 'immutable'
ImmutableRenderMixin = require '../../../../../../react/mixins/ImmutableRendererMixin'
SnowflakeDataTypesList = React.createFactory(require('./SnowflakeDataTypesList'))
SnowflakeDataTypesAddForm = React.createFactory(require('./SnowflakeDataTypesAddForm'))
_ = require('underscore')

module.exports = React.createClass
  displayName: 'SnowflakeDataTypesContainer'
  mixins: [ImmutableRenderMixin]

  propTypes:
    value: React.PropTypes.object.isRequired
    columnsOptions: React.PropTypes.array.isRequired
    onChange: React.PropTypes.func.isRequired
    disabled: React.PropTypes.bool.isRequired

  getInitialState: ->
    column: ""
    datatype: ""
    size: ""
    convertEmptyValuesToNull: false

  _handleColumnOnChange: (selected) ->
    @setState
      column: if selected then selected.value else ""
      size: ""

  _handleDataTypeOnChange: (selected) ->
    @setState
      datatype: if selected then selected.value else ""
      size: ""

  _handleSizeOnChange: (value) ->
    @setState
      size: value

  _handleConvertEmptyValuesToNullOnChange: (value) ->
    @setState
      convertEmptyValuesToNull: value

  _handleAddDataType: ->
    datatype =
      column: @state.column
      type: @state.datatype
      length: @state.size
      convertEmptyValuesToNull: @state.convertEmptyValuesToNull
    value = @props.value.set(@state.column, Immutable.fromJS(datatype))
    @props.onChange(value)
    @setState
      column: ""
      datatype: ""
      size: ""
      convertEmptyValuesToNull: false

  _handleRemoveDataType: (key) ->
    value = @props.value.remove(key)
    @props.onChange(value)

  _datatypesMap:
    NUMBER:
      name: "NUMBER",
      size: true
    FLOAT:
      name: "FLOAT",
      size: false
    VARCHAR:
      name: "VARCHAR",
      size: true,
    DATE:
      name: "DATE",
      size: false
    TIMESTAMP:
      name: "TIMESTAMP",
      size: false
    TIMESTAMP_LTZ:
      name: "TIMESTAMP_LTZ",
      size: false
    TIMESTAMP_NTZ:
      name: "TIMESTAMP_NTZ",
      size: false
    TIMESTAMP_TZ:
      name: "TIMESTAMP_TZ",
      size: false

  _getDatatypeOptions: ->
    _.keys(@_datatypesMap)

  _getAvailableColumnsOptions: ->
    component = @
    _.filter(@props.columnsOptions, (option) ->
      !_.contains(_.keys(component.props.value.toJS()), option.value)
    )

  render: ->
    React.DOM.span null,
      SnowflakeDataTypesList
        datatypes: @props.value
        handleRemoveDataType: @_handleRemoveDataType
      SnowflakeDataTypesAddForm
        datatypes: @props.value
        columnValue: @state.column
        datatypeValue: @state.datatype
        sizeValue: @state.size
        convertEmptyValuesToNullValue: @state.convertEmptyValuesToNull
        datatypeOptions: @_getDatatypeOptions()
        showSize: if @state.datatype then @_datatypesMap[@state.datatype].size else false
        columnsOptions: @props.columnsOptions
        columnOnChange: @_handleColumnOnChange
        datatypeOnChange: @_handleDataTypeOnChange
        sizeOnChange: @_handleSizeOnChange
        convertEmptyValuesToNullOnChange: @_handleConvertEmptyValuesToNullOnChange
        handleAddDataType: @_handleAddDataType
        disabled: @props.disabled
        availableColumns: @_getAvailableColumnsOptions()

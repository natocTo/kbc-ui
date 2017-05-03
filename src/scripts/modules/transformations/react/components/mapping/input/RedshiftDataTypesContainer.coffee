React = require 'react'
Immutable = require 'immutable'
ImmutableRenderMixin = require '../../../../../../react/mixins/ImmutableRendererMixin'
RedshiftDataTypesAddForm = React.createFactory(require('./RedshiftDataTypesAddForm'))
RedshiftDataTypesList = React.createFactory(require('./RedshiftDataTypesList'))
_ = require('underscore')

module.exports = React.createClass
  displayName: 'RedshiftDataTypesContainer'
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
    compression: ""
    convertEmptyValuesToNull: false

  _handleColumnOnChange: (selected) ->
    @setState
      column: if selected then selected.value else ""
      size: ""
      compression: ""

  _handleDataTypeOnChange: (selected) ->
    @setState
      datatype: if selected then selected.value else ""
      size: ""
      compression: ""
      convertEmptyValuesToNull: false

  _handleSizeOnChange: (value) ->
    @setState
      size: value

  _handleCompressionOnChange: (selected) ->
    @setState
      compression: if selected then selected.value else ""

  _handleConvertEmptyValuesToNullOnChange: (value) ->
    @setState
      convertEmptyValuesToNull: value

  _handleAddDataType: ->
    datatype =
      column: @state.column
      type: @state.datatype
      length: @state.size
      compression: @state.compression
      convertEmptyValuesToNull: @state.convertEmptyValuesToNull
    value = @props.value.set(@state.column, Immutable.fromJS(datatype))
    @props.onChange(value)
    @setState
      column: ""
      datatype: ""
      size: ""
      compression: ""
      convertEmptyValuesToNull: false


  _handleRemoveDataType: (key) ->
    value = @props.value.remove(key)
    @props.onChange(value)

  _datatypesMap:
    SMALLINT:
      name: "SMALLINT",
      size: false,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT", "LZO", "DELTA", "MOSTLY8"]
    INTEGER:
      name: "INTEGER",
      size: false,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT", "LZO", "DELTA", "DELTA32K", "MOSTLY8", "MOSTLY16"]
    BIGINT:
      name: "BIGINT",
      size: false,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT", "LZO", "DELTA", "DELTA32K", "MOSTLY8", "MOSTLY16", "MOSTLY32"]
    DECIMAL:
      name: "DECIMAL",
      size: true,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT", "LZO", "DELTA32K", "MOSTLY8", "MOSTLY16", "MOSTLY32"]
    REAL:
      name: "REAL",
      size: false,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT"]
    "DOUBLE PRECISION":
      name: "DOUBLE PRECISION",
      size: false,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT"]
    "BOOLEAN":
      name: "BOOLEAN",
      size: false,
      compression: ["RAW", "RUNLENGTH"]
    "CHAR":
      name: "CHAR",
      size: true,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT", "LZO"]
    "VARCHAR":
      name: "VARCHAR",
      size: true,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT", "LZO", "TEXT255", "TEXT32K"]
    "DATE":
      name: "DATE",
      size: false,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT", "DELTA", "DELTA32K"]
    "TIMESTAMP":
      name: "TIMESTAMP",
      size: false,
      compression: ["RAW", "RUNLENGTH", "BYTEDICT", "DELTA", "DELTA32K"]

  _getDatatypeOptions: ->
    _.keys(@_datatypesMap)

  _getAvailableColumnsOptions: ->
    component = @
    _.filter(@props.columnsOptions, (option) ->
      !_.contains(_.keys(component.props.value.toJS()), option.value)
    )

  render: ->
    React.DOM.span null,
        RedshiftDataTypesList
          datatypes: @props.value
          handleRemoveDataType: @_handleRemoveDataType
      ,
        RedshiftDataTypesAddForm
          columnValue: @state.column
          datatypeValue: @state.datatype
          sizeValue: @state.size
          compressionValue: @state.compression
          convertEmptyValuesToNullValue: @state.convertEmptyValuesToNull
          datatypeOptions: @_getDatatypeOptions()
          showSize: if @state.datatype then @_datatypesMap[@state.datatype].size else false
          compressionOptions: if @state.datatype then @_datatypesMap[@state.datatype].compression else []
          columnsOptions: @props.columnsOptions
          columnOnChange: @_handleColumnOnChange
          datatypeOnChange: @_handleDataTypeOnChange
          sizeOnChange: @_handleSizeOnChange
          compressionOnChange: @_handleCompressionOnChange
          convertEmptyValuesToNullOnChange: @_handleConvertEmptyValuesToNullOnChange
          handleAddDataType: @_handleAddDataType
          disabled: @props.disabled
          availableColumns: @_getAvailableColumnsOptions()


React = require 'react'
Immutable = require 'immutable'
ImmutableRenderMixin = require 'react-immutable-render-mixin'
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
    tableId: React.PropTypes.string

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

  _handleAutoloadDataTypes: (column, metadata) ->
    datatypeLength = metadata.filter (entry) ->
      entry.get('key') == 'KBC.datatype.length'
    if datatypeLength.length > 0
      datatypeLength = datatypeLength.get(0)

    datatypeNullable = metadata.filter (entry) ->
      entry.get('key') == 'KBC.datatype.nullable'
    if datatypeNullable.length > 0
      datatypeNullable = datatypeNullable.get(0)

    basetype = metadata.filter (entry) ->
      entry.get('key') == 'KBC.datatype.basetype'
    if basetype.length == 0
      null
    else
      basetype = basetype.get(0)
    datatype = Immutable.fromJS(@_datatypesMap).filter (datatype) ->
      datatype.get('basetype') == basetype.get('value')
    type =
      column: column
      type: datatype.name
      length: datatypeLength.get('value')
      convertEmptyValuesToNull: datatypeNullable.get('value')
    value = @props.value.set(column, Immutable.fromJS(type))
    @props.onChange(value)

  _datatypesMap:
    INTEGER:
      name: "INTEGER",
      basetype: "INTEGER",
      size: true,
    NUMBER:
      name: "NUMBER",
      basetype: "NUMERIC",
      size: true
    FLOAT:
      name: "FLOAT",
      basetype: "FLOAT",
      size: false
    VARCHAR:
      name: "VARCHAR",
      basetype: "STRING",
      size: true,
    DATE:
      name: "DATE",
      basetype: "DATE",
      size: false
    TIMESTAMP:
      name: "TIMESTAMP",
      basetype: "TIMESTAMP",
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
    VARIANT:
      name: "VARIANT",
      size: false

  _getDatatypeOptions: ->
    _.keys(@_datatypesMap)

  _getAvailableColumnsOptions: ->
    component = @
    _.filter(@props.columnsOptions, (option) ->
      !_.contains(_.keys(component.props.value.toJS()), option.value)
    )

  _getColumns: ->
    _.map(@props.columnsOptions, (option) ->
      option.value
    )

  render: ->
    React.DOM.span null,
      SnowflakeDataTypesList
        datatypes: @props.value
        handleRemoveDataType: @_handleRemoveDataType
        tableId: @props.tableId
        columns: @_getColumns()
        disabled: @props.disabled
        handleAutoloadDataTypes: @_handleAutoloadDataTypes
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

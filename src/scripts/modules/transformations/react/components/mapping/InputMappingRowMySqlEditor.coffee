React = require 'react'
_ = require('underscore')
Immutable = require('immutable')
{Input} = require('./../../../../../react/common/KbcBootstrap')
Input = React.createFactory Input
Select = React.createFactory require('../../../../../react/common/Select').default
SapiTableSelector = React.createFactory(require('../../../../components/react/components/SapiTableSelector'))
MySqlIndexesContainer = React.createFactory(require("./input/MySqlIndexesContainer"))
MySqlDataTypesContainer = React.createFactory(require("./input/MySqlDataTypesContainer"))
ChangedSinceInput = React.createFactory(require('../../../../../react/common/ChangedSinceInput').default)
whereOperatorConstants = require('../../../../../react/common/whereOperatorConstants').default


module.exports = React.createClass
  displayName: 'InputMappingRowMySqlEditor'

  propTypes:
    value: React.PropTypes.object.isRequired
    tables: React.PropTypes.object.isRequired
    onChange: React.PropTypes.func.isRequired
    disabled: React.PropTypes.bool.isRequired
    initialShowDetails: React.PropTypes.bool.isRequired
    isDestinationDuplicate: React.PropTypes.bool.isRequired

  getInitialState: ->
    showDetails: @props.initialShowDetails

  shouldComponentUpdate: (nextProps, nextState) ->
    should = @props.value != nextProps.value ||
    @props.tables != nextProps.tables ||
    @props.disabled != nextProps.disabled ||
    @state.showDetails != nextState.showDetails

    should

  _handleToggleShowDetails: (e) ->
    @setState(
      showDetails: e.target.checked
    )

  _handleChangeSource: (value) ->
    # use only table name from the table identifier
    if value
      destination = value.substr(value.lastIndexOf(".") + 1)
    else
      destination = ''
    immutable = @props.value.withMutations (mapping) ->
      mapping = mapping.set("source", value)
      mapping = mapping.set("destination", destination)
      mapping = mapping.set("indexes", Immutable.List())
      mapping = mapping.set("datatypes", Immutable.Map())
      mapping = mapping.set("whereColumn", "")
      mapping = mapping.set("whereValues", Immutable.List())
      mapping = mapping.set("whereOperator", "eq")
      mapping = mapping.set("columns", Immutable.List())
    @props.onChange(immutable)

  _handleChangeDestination: (e) ->
    value = @props.value.set("destination", e.target.value.trim())
    @props.onChange(value)

  _handleChangeOptional: (e) ->
    value = @props.value.set("optional", e.target.checked)
    @props.onChange(value)

  _handleChangeChangedSince: (changedSince) ->
    value = @props.value
    if @props.value.has("days")
      value = value.delete("days")
    value = value.set("changedSince", changedSince)
    @props.onChange(value)

  _handleChangeColumns: (newValue) ->
    immutable = @props.value.withMutations (mapping) ->
      mapping = mapping.set("columns", newValue)
      if !_.contains(mapping.get("columns").toJS(), mapping.get("whereColumn"))
        mapping = mapping.set("whereColumn", "")
        mapping = mapping.set("whereValues", Immutable.List())
        mapping = mapping.set("whereOperator", "eq")

      datatypes = _.pick(mapping.get("datatypes").toJS(), mapping.get("columns").toJS())
      mapping = mapping.set("datatypes", Immutable.fromJS(datatypes || Immutable.Map()))

      indexes = _.filter(mapping.get("indexes").toJS(), (index) ->
        _.filter(index, (indexPart) ->
          _.contains(mapping.get("columns").toJS(), indexPart)
        ).length == index.length
      )
      mapping = mapping.set("indexes", Immutable.fromJS(indexes || Immutable.List()))

    @props.onChange(immutable)

  _handleChangeIndexes: (indexes) ->
    value = @props.value.set("indexes", indexes)
    @props.onChange(value)

  _handleChangeWhereColumn: (string) ->
    value = @props.value.set("whereColumn", string)
    @props.onChange(value)

  _handleChangeWhereOperator: (e) ->
    value = @props.value.set("whereOperator", e.target.value)
    @props.onChange(value)

  _handleChangeWhereValues: (newValue) ->
    value = @props.value.set("whereValues", newValue)
    @props.onChange(value)

  _handleChangeDataTypes: (datatypes) ->
    value = @props.value.set("datatypes", datatypes)
    @props.onChange(value)

  _getColumns: ->
    if !@props.value.get("source")
      return []
    props = @props
    table = @props.tables.find((table) ->
      table.get("id") == props.value.get("source")
    )
    return [] if !table
    table.get("columns").toJS()

  _getColumnsOptions: ->
    columns = @_getColumns()
    map = _.map(
      columns, (column) ->
        {
          label: column
          value: column
        }
    )

  _getFilteredColumnsOptions: ->
    if @props.value.get("columns", Immutable.List()).count()
      columns = @props.value.get("columns").toJS()
    else
      columns = @_getColumns()
    _.map(
      columns, (column) ->
        {
          label: column
          value: column
        }
    )

  render: ->
    React.DOM.div {className: 'form-horizontal clearfix'},
      React.DOM.div {className: "row col-md-12"},
        React.DOM.div className: 'form-group',
          React.DOM.div className: 'col-xs-10 col-xs-offset-2',
            Input
              standalone: true
              type: 'checkbox'
              label: 'Show details'
              checked: @state.showDetails
              onChange: @_handleToggleShowDetails

      React.DOM.div {className: "row col-md-12"},
        React.DOM.div className: 'form-group',
          React.DOM.label className: 'col-xs-2 control-label', 'Source'
          React.DOM.div className: 'col-xs-10',
            SapiTableSelector
              value: @props.value.get("source", '')
              disabled: @props.disabled
              placeholder: "Source table"
              onSelectTableFn: @_handleChangeSource
              autoFocus: true
            if @state.showDetails
              React.DOM.div className: 'checkbox',
                React.DOM.label null,
                  React.DOM.input
                    standalone: true
                    type: 'checkbox'
                    checked: @props.value.get("optional")
                    disabled: @props.disabled
                    onChange: @_handleChangeOptional
                  ' Optional'
                React.DOM.span className: 'help-block',
                  "If this table does not exist in Storage, the transformation won't show an error."
      React.DOM.div {className: "row col-md-12"},
        Input
          type: 'text'
          label: 'Destination'
          value: @props.value.get("destination")
          disabled: @props.disabled
          placeholder: "Destination table name in transformation DB"
          onChange: @_handleChangeDestination
          labelClassName: 'col-xs-2'
          wrapperClassName: 'col-xs-10'
          bsStyle: if @props.isDestinationDuplicate then 'error' else null
          help:
            if @props.isDestinationDuplicate then React.DOM.span {'className': 'error'},
              'Duplicate destination '
              React.DOM.code {}, @props.value.get("destination")
              '.'
            else null
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group',
            React.DOM.label className: 'col-xs-2 control-label', 'Columns'
            React.DOM.div className: 'col-xs-10',
              Select
                multi: true
                name: 'columns'
                value: @props.value.get("columns", Immutable.List())
                disabled: @props.disabled || !@props.value.get("source")
                placeholder: "All columns will be imported"
                onChange: @_handleChangeColumns
                options: @_getColumnsOptions()
              React.DOM.div
                className: "help-block"
              ,
                "Import only specified columns"
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group',
            React.DOM.label className: 'col-xs-2 control-label', 'Changed in last'
            React.DOM.div className: 'col-xs-10',
              ChangedSinceInput
                value: @props.value.get(
                  "changedSince",
                  if (@props.value.get("days") > 0) then "-" + @props.value.get("days") + " days" else null
                )
                disabled: @props.disabled || !@props.value.get("source")
                onChange: @_handleChangeChangedSince
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group',
            React.DOM.label className: 'col-xs-2 control-label', 'Data filter'
            React.DOM.div className: 'col-xs-4',
              Select
                name: 'whereColumn'
                value: @props.value.get("whereColumn")
                disabled: @props.disabled || !@props.value.get("source")
                placeholder: "Select column"
                onChange: @_handleChangeWhereColumn
                options: @_getColumnsOptions()
            React.DOM.div className: 'col-xs-2',
              Input
                type: 'select'
                name: 'whereOperator'
                value: @props.value.get("whereOperator")
                disabled: @props.disabled
                onChange: @_handleChangeWhereOperator
              ,
                React.DOM.option {value: whereOperatorConstants.EQ_VALUE}, whereOperatorConstants.EQ_LABEL
                React.DOM.option {value: whereOperatorConstants.NOT_EQ_VALUE}, whereOperatorConstants.NOT_EQ_LABEL
            React.DOM.div className: 'col-xs-4',
              Select
                name: 'whereValues'
                value: @props.value.get('whereValues')
                multi: true
                disabled: @props.disabled
                allowCreate: true
                delimiter: ','
                placeholder: 'Add a value...'
                emptyStrings: true,
                onChange: @_handleChangeWhereValues
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group',
            React.DOM.label className: 'col-xs-2 control-label', 'Indexes'
            React.DOM.div className: 'col-xs-10',
              MySqlIndexesContainer
                value: @props.value.get("indexes", Immutable.List())
                disabled: @props.disabled || !@props.value.get("source")
                onChange: @_handleChangeIndexes
                columnsOptions: @_getFilteredColumnsOptions()
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group',
            React.DOM.label className: 'col-xs-2 control-label', 'Data types'
            React.DOM.div className: 'col-xs-10',
              MySqlDataTypesContainer
                value: @props.value.get("datatypes", Immutable.Map())
                disabled: @props.disabled || !@props.value.get("source")
                onChange: @_handleChangeDataTypes
                columnsOptions: @_getFilteredColumnsOptions()

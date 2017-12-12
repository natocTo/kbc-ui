React = require 'react'
_ = require('underscore')
Immutable = require('immutable')
{Input} = require('./../../../../../react/common/KbcBootstrap')
Input = React.createFactory Input
Select = React.createFactory require('../../../../../react/common/Select').default
SapiTableSelector = React.createFactory(require('../../../../components/react/components/SapiTableSelector'))
RedshiftDataTypesContainer = React.createFactory(require("./input/RedshiftDataTypesContainer"))
ChangedSinceInput = React.createFactory(require('../../../../../react/common/ChangedSinceInput').default)

module.exports = React.createClass
  displayName: 'InputMappingRowRedshiftEditor'

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

  distStyleOptions: [
      label: "EVEN"
      value: "EVEN"
    ,
      label: "KEY"
      value: "KEY"
    ,
      label: "ALL"
      value: "ALL"
  ]

  _handleChangeSource: (value) ->
    # use only table name from the table identifier
    if value
      destination = value.substr(value.lastIndexOf(".") + 1)
    else
      destination = ''
    immutable = @props.value.withMutations (mapping) ->
      mapping = mapping.set("source", value)
      mapping = mapping.set("destination", destination)
      mapping = mapping.set("datatypes", Immutable.Map())
      mapping = mapping.set("whereColumn", "")
      mapping = mapping.set("whereValues", Immutable.List())
      mapping = mapping.set("whereOperator", "eq")
      mapping = mapping.set("columns", Immutable.List())
      mapping = mapping.set("sortKey", "")
      mapping = mapping.set("distKey", "")
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
    component = @
    immutable = @props.value.withMutations (mapping) ->
      mapping = mapping.set("columns", newValue)
      if newValue.count()

        columns = mapping.get("columns").toJS()
        if !_.contains(columns, mapping.get("whereColumn"))
          mapping = mapping.set("whereColumn", "")
          mapping = mapping.set("whereValues", Immutable.List())
          mapping = mapping.set("whereOperator", "eq")

        datatypes = _.pick(mapping.get("datatypes").toJS(), columns)
        mapping = mapping.set("datatypes", Immutable.fromJS(datatypes || Immutable.Map()))

        if !_.contains(columns, mapping.get("distKey"))
          mapping = mapping.set("distKey", "")
          mapping = mapping.set("distStyle", "")

        mapping = mapping.set("sortKey", _.intersection(
          columns,
          component.props.value.get("sortKey").split(",")
        ).join(","))

    @props.onChange(immutable)

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

  _handleChangeSortKey: (immutable) ->
    value = @props.value.set("sortKey", immutable.join())
    @props.onChange(value)

  _handleChangeDistKey: (string) ->
    value = @props.value.set("distKey", string)
    @props.onChange(value)

  _handleChangeDistStyle: (string) ->
    value = @props.value.set("distStyle", string)
    if string != 'KEY'
      value = value.set("distKey", "")
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

  _isSourceTableRedshift: ->
    props = @props
    table = @props.tables.find((table) ->
      table.get("id") == props.value.get("source")
    )
    if !table
      return false
    else
      return table.getIn(["bucket", "backend"]) == "redshift"

  _getSortKeyImmutable: ->
    if @props.value.get("sortKey")
      Immutable.fromJS(@props.value.get("sortKey").split(","))
    else
      Immutable.List()

  render: ->
    component = @
    React.DOM.div {className: 'form-horizontal clearfix'},
      React.DOM.div {className: "row col-md-12"},
        React.DOM.div className: 'form-group form-group-sm',
          React.DOM.div className: 'col-xs-10 col-xs-offset-2',
            Input
              standalone: true
              type: 'checkbox'
              label: React.DOM.small {}, 'Show details'
              checked: @state.showDetails
              onChange: @_handleToggleShowDetails

      React.DOM.div {className: "row col-md-12"},
        React.DOM.div className: 'form-group',
          React.DOM.label className: 'col-xs-2 control-label', 'Source'
          React.DOM.div className: 'col-xs-10',
            SapiTableSelector
              value: @props.value.get("source")
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
                  React.DOM.small null, ' Optional'
                React.DOM.small className: 'help-block',
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
          help: if @props.isDestinationDuplicate then React.DOM.small {'className': 'error'},
              'Duplicate destination '
              React.DOM.code {}, @props.value.get("destination")
              '.'
            else null
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group form-group-sm',
            React.DOM.label className: 'col-xs-2 control-label', 'Columns'
            React.DOM.div className: 'col-xs-10',
              Select
                multi: true
                name: 'columns'
                value: @props.value.get("columns", Immutable.List()).toJS()
                disabled: @props.disabled || !@props.value.get("source")
                placeholder: "All columns will be imported"
                onChange: @_handleChangeColumns
                options: @_getColumnsOptions()
              React.DOM.div
                className: "help-block"
              ,
                React.DOM.small {}, "Import only specified columns"
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group form-group-sm',
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
          React.DOM.div className: 'form-group form-group-sm',
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
                bsSize: 'small'
                type: 'select'
                name: 'whereOperator'
                value: @props.value.get("whereOperator")
                disabled: @props.disabled
                onChange: @_handleChangeWhereOperator
              ,
                React.DOM.option {value: "eq"}, "= (IN)"
                React.DOM.option {value: "ne"}, "!= (NOT IN)"
            React.DOM.div className: 'col-xs-4',
              Select
                name: 'whereValues'
                value: @props.value.get('whereValues')
                multi: true
                disabled: @props.disabled
                allowCreate: true
                delimiter: ','
                placeholder: 'Select values...'
                emptyStrings: true,
                onChange: @_handleChangeWhereValues
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group form-group-sm',
            React.DOM.label className: 'col-xs-2 control-label', 'Data types'
            React.DOM.div className: 'col-xs-10',
              RedshiftDataTypesContainer
                value: @props.value.get("datatypes", Immutable.Map())
                disabled: @props.disabled || !@props.value.get("source")
                onChange: @_handleChangeDataTypes
                columnsOptions: @_getFilteredColumnsOptions()
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group form-group-sm',
            React.DOM.label className: 'col-xs-2 control-label', 'Sort key'
            React.DOM.div className: 'col-xs-10',
              Select
                multi: true
                name: 'sortKey'
                value: @_getSortKeyImmutable()
                disabled: @props.disabled || !@props.value.get("source")
                placeholder: "No sortkey"
                onChange: @_handleChangeSortKey
                options: @_getFilteredColumnsOptions()
              React.DOM.div className: "help-block",
                React.DOM.small {},
                  "SORTKEY option for creating table in Redshift DB.
                    You can create a compound sort key."
      if @state.showDetails
        React.DOM.div {className: "row col-md-12"},
          React.DOM.div className: 'form-group form-group-sm',
            React.DOM.label className: 'col-xs-2 control-label', 'Distribution'
            React.DOM.div className: 'col-xs-5',
              Select
                name: 'distStyle'
                value: @props.value.get("distStyle")
                disabled: @props.disabled || !@props.value.get("source")
                placeholder: "Style"
                onChange: @_handleChangeDistStyle
                options: @distStyleOptions
            React.DOM.div className: 'col-xs-5',
              Select
                name: 'distKey'
                value: @props.value.get("distKey")
                disabled: @props.disabled || !@props.value.get("source") || @props.value.get("distStyle") != "KEY"
                placeholder: (
                  if @props.value.get("distStyle") == "KEY"
                    "Select column"
                  else
                    "Column selection not available"
                )
                onChange: @_handleChangeDistKey
                options: @_getFilteredColumnsOptions()
            React.DOM.div
              className: "col-xs-offset-2 col-xs-10 help-block"
            ,
              React.DOM.small {},
                "DISTKEY and DISTSTYLE options used for
                  CREATE TABLE query in Redshift."

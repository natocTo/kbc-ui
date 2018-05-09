React = require 'react'
ImmutableRenderMixin = require 'react-immutable-render-mixin'
{ ListGroup, ListGroupItem } = require('react-bootstrap')
ListGroup = React.createFactory ListGroup
ListGroupItem = React.createFactory ListGroupItem
DatatypeLabel = React.createFactory require('./DatatypeLabel').default
DatatypeAutoloader = React.createFactory require('./DatatypeAutoloader').default

module.exports = React.createClass
  displayName: 'SnowflakeDataTypesList'
  mixins: [ImmutableRenderMixin]

  propTypes:
    tableId: React.PropTypes.string
    datatypes: React.PropTypes.object.isRequired
    handleRemoveDataType: React.PropTypes.func.isRequired
    handleAutoloadDataTypes: React.PropTypes.func

  render: ->
    component = @
    React.DOM.span {},
      React.DOM.div {className: "row"},
        React.DOM.span {className: "col-xs-12"},
        if !@props.datatypes.count()
          React.DOM.p {},
            "No data types set yet."
            if this.props.tableId
              DatatypeAutoloader
                tableId: this.props.tableId
                columns: this.props.columns
                handleAutoloadDataTypes: this.props.handleAutoloadDataTypes
        else
          ListGroup {},
            @props.datatypes.sort().map((datatype, key) ->
              ListGroupItem {key: key},
                DatatypeLabel
                  column: key
                  datatype: datatype
                React.DOM.i
                  className: "kbc-icon-cup kbc-cursor-pointer pull-right"
                  onClick: ->
                    component.props.handleRemoveDataType(key)
            , @).toArray()

React = require 'react'
ImmutableRenderMixin = require '../../../../../../react/mixins/ImmutableRendererMixin'
{ ListGroup, ListGroupItem } = require('react-bootstrap')
ListGroup = React.createFactory ListGroup
ListGroupItem = React.createFactory ListGroupItem
DatatypeLabel = React.createFactory require('./DatatypeLabel').default

module.exports = React.createClass
  displayName: 'SnowflakeDataTypesList'
  mixins: [ImmutableRenderMixin]

  propTypes:
    datatypes: React.PropTypes.object.isRequired
    handleRemoveDataType: React.PropTypes.func.isRequired

  render: ->
    component = @
    React.DOM.span {},
      React.DOM.div {className: "row"},
        React.DOM.span {className: "col-xs-12"},
        if !@props.datatypes.count()
          React.DOM.p {}, React.DOM.small {}, "No data types set yet."
        else
          ListGroup {},
            @props.datatypes.sort().map((datatype, key) ->
              ListGroupItem {key: key},
                  React.DOM.small {},
                    DatatypeLabel
                      column: key
                      datatype: datatype
                    React.DOM.i
                      className: "kbc-icon-cup kbc-cursor-pointer pull-right"
                      onClick: ->
                        component.props.handleRemoveDataType(key)
            , @).toArray()

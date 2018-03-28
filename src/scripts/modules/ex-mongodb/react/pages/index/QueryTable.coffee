React = require 'react'
ImmutableRenderMixin = require '../../../../../react/mixins/ImmutableRendererMixin'
{Map} = require 'immutable'

QueryRow = React.createFactory(require('./QueryRow').default)
LinkToBucket = React.createFactory require('./../../components/LinkToBucket').default
Link = React.createFactory(require('react-router').Link)

CreateQueryElement = React.createFactory(require('../../components/CreateQueryElement').default)

{span, div, i, strong, p} = React.DOM

module.exports = React.createClass
  displayName: 'QueryTable'
  mixins: [ImmutableRenderMixin]
  propTypes:
    queries: React.PropTypes.object
    configurationId: React.PropTypes.string
    componentId: React.PropTypes.string
    pendingActions: React.PropTypes.object
    actionCreators: React.PropTypes.object

  render: ->
    childs = @props.queries.map((query) ->
      QueryRow
        query: query
        componentId: @props.componentId
        pendingActions: @props.pendingActions.get query.get('id'), Map()
        configurationId: @props.configurationId
        key: query.get('id')
    , @).toArray()

    div null,

      div className: 'kbc-inner-padding',
        div className: 'text-right',
          CreateQueryElement
            isNav: false,
            componentId: @props.componentId,
            configurationId: @props.configurationId,
            actionCreators: @props.actionCreators
        p null,
          'Output bucket: '
          LinkToBucket
            configurationId: @props.configurationId

      div className: 'table table-striped table-hover',
        div className: 'thead', key: 'table-header',
          div className: 'tr',
            span className: 'th',
              strong null, 'Name'
            span className: 'th',
              strong null, 'Incremental'
            span className: 'th'
        div className: 'tbody',
          childs

React = require 'react'

createStoreMixin = require '../../../../react/mixins/createStoreMixin'
InstalledComponentsStore = require '../../stores/InstalledComponentsStore'

{Link} = require('react-router')
NewComponentButton = require './NewComponentButton'

{span, button} = React.DOM

module.exports = React.createClass
  displayName: 'ComponentsHeaderButtons'
  mixins: [createStoreMixin(InstalledComponentsStore)]
  propTypes:
    type: React.PropTypes.string.isRequired
    addRoute: React.PropTypes.string.isRequired
    trashRoute: React.PropTypes.string.isRequired

  getStateFromStores: ->
    hasInTrash: InstalledComponentsStore.getAllDeletedForType(@props.type).count()

  render: ->
    span {},
      if @state.hasInTrash
        React.createElement Link,
          to: @props.trashRoute
        ,
          button className: 'btn btn-link',
            span className: 'kbc-icon-cup'
            ' Open Trash'
      React.createElement NewComponentButton,
        to: @props.addRoute
        text: 'New ' + @props.type[0].toUpperCase() + @props.type.substr(1)
        type: @props.type


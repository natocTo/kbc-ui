React = require 'react'

{div, button, span} = React.DOM


ProjectsList = require './List'


module.exports = React.createClass
  displayName: 'ProjectSelect'

  propTypes:
    organizations: React.PropTypes.object.isRequired
    currentProject: React.PropTypes.object.isRequired
    urlTemplates: React.PropTypes.object.isRequired
    projectTemplates: React.PropTypes.object.isRequired
    xsrf: React.PropTypes.string.isRequired
    canCreateProject: React.PropTypes.bool.isRequired

  getInitialState: ->
    open: false

  render: ->
    if @state.open then className = 'open' else ''
    div className: "kbc-project-select dropdown #{className}",
      button onClick: @_handleDropdownClick, title: @props.currentProject.get('name'),
        span null,
          span className: 'kbc-icon-picker-double'
          span className: 'kbc-project-name',
            @props.currentProject.get('name')
      div className: 'dropdown-menu',
      React.createElement ProjectsList,
        organizations: @props.organizations
        currentProjectId: @props.currentProject.get('id')
        urlTemplates: @props.urlTemplates
        projectTemplates: @props.projectTemplates
        xsrf: @props.xsrf
        canCreateProject: @props.canCreateProject
        focus: @state.open

  setDropdownState: (newState) ->
    @setState({open: newState})

  _handleDropdownClick: (e) ->
    e.preventDefault()
    @setDropdownState(!@state.open)

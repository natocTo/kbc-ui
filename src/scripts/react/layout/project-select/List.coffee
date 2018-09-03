React = require 'react'
fuzzy = require 'fuzzy'
{List, Map} = require 'immutable'
Tooltip = require('../../common/Tooltip').default
SearchBar = require('@keboola/indigo-ui').SearchBar
_ = require 'underscore'

NewProjectModal = require('../NewProjectModal').default
Emptylist = require('./EmptyList').default

{div, ul, li, a, span, input, i} = React.DOM

module.exports = React.createClass
  displayName: 'ProjectSelectDropdown'
  propTypes:
    organizations: React.PropTypes.object.isRequired
    currentProjectId: React.PropTypes.number.isRequired
    urlTemplates: React.PropTypes.object.isRequired
    projectTemplates: React.PropTypes.object.isRequired
    focus: React.PropTypes.bool.isRequired
    canCreateProject: React.PropTypes.bool.isRequired
    xsrf: React.PropTypes.string.isRequired

  getInitialState: ->
    query: ''
    selectedProjectId: null
    selectedOrganizationId: null
    isNewProjectModalOpen: false

  componentDidMount: ->
    if @props.focus &&  @refs.searchInput
      @refs.searchInput.focus()

  componentDidUpdate: (prevProps) ->
    if @refs.searchInput && @props.focus && @props.focus != prevProps.focus
      @refs.searchInput.focus()

  render: ->
    if !@props.organizations.count() && !@props.canCreateProject
      return React.createElement Emptylist
    div null,
      ul className: 'list-unstyled',
        li className: 'dropdown-header kb-nav-search',
          React.createElement SearchBar,
            onChange: @_handleQueryChange
            query: @state.query
            placeholder: 'Search your projects'
            onKeyDown: @_handleKeyDown
            className: @_getSearchbarClassName()
      @_projectsList()
      @_newProject() if @props.canCreateProject

  _getSearchbarClassName: ->
    parentComponent = this._reactInternalInstance._currentElement._owner._instance.__proto__.constructor.displayName
    if parentComponent != 'App'
      return "searchbar-inverse"
    else
      return null

  _projectsList: ->
    organizations = @_organizationsFiltered()
    if organizations.size
      elements = organizations.map((organization) ->

        organizationElement = li className: 'dropdown-header', key: "org-#{organization.get('id')}",
          if organization.get('hasAccess')
            a
              href: @_organizationUrl(organization.get 'id')
              className: if @state.selectedOrganizationId == organization.get('id') then 'active' else ''
            ,
              organization.get('name')
          else
            span
              className: 'disabled'
            ,
              organization.get('name')

        projectElements = organization.get('projects').map((project) ->
          li key: "proj-#{project.get('id')}",
            if project.get('isDisabled')
              React.createElement Tooltip,
                tooltip: 'Project is disabled. ' + project.get('disabledReason')
                placement: 'top'
              ,
                span
                  className: 'disabled'
                ,
                  project.get('name')
            else
              a
                href: @_projectUrl(project.get 'id')
                className: if @state.selectedProjectId == project.get('id') then 'active' else ''
              ,
                project.get('name')
        , @).toArray()

        [[organizationElement], projectElements]
      , @).flatten().toArray()
    else
      elements = li className: '',
        React.DOM.a {className: 'kbc-link-disabled'},
          React.DOM.em {}, 'No projects found'

    ul className: 'list-unstyled kbc-project-select-results', elements


  _organizationsFiltered: ->
    filter = @state.query
    @props.organizations
    .map (organization) ->
      organization.set 'projects', organization.get('projects').filter((project) ->
        fuzzy.match(filter, project.get('name'))
      )
    .filter (organization) ->
      return true if !filter
      return true if organization.get('projects').count() > 0
      return true if fuzzy.match(filter, organization.get('name'))
      return false

  _projectUrl: (id) ->
    _.template(@props.urlTemplates.get('project'))(projectId: id)

  _organizationUrl: (id) ->
    _.template(@props.urlTemplates.get('organization'))(organizationId: id)

  _handleQueryChange: (changedQuery) ->
    @setState
      query: changedQuery

  _handleKeyDown: (keyDown) ->
    switch keyDown
      when 'ArrowDown' then @_selectNextProjectOrOrganization()
      when 'ArrowUp' then @_selectPreviousProjectOrOrganization()
      when 'Enter' then @_goToSelectedProjectOrOrganization()


  _selectNextProjectOrOrganization: ->
    @_moveSelectedProjecteOrOrganization false

  _selectPreviousProjectOrOrganization: ->
    @_moveSelectedProjecteOrOrganization true

  _moveSelectedProjecteOrOrganization: (previous = false) ->
    organizations = @_organizationsFiltered()
    return if !organizations.count()

    # flat map of organizations and projects
    organizationsAndProjects = organizations
    .map (organization) ->
      org = Map
        type: 'organization'
        id: organization.get 'id'

      projects = organization.get 'projects'
      .map (project) ->
        Map
          type: 'project'
          id: project.get 'id'

      List [List([org]), projects]
    .flatten(2)


    if !@state.selectedProjectId && !@state.selectedOrganizationId
      if previous
        item = organizationsAndProjects.last()
      else
        item = organizationsAndProjects.first()

      return @_setSelectedItem item

    selectedIndex = organizationsAndProjects.findIndex (item) ->
      if @state.selectedProjectId
        id = @state.selectedProjectId
        type = 'project'
      else
        id = @state.selectedOrganizationId
        type = 'organization'
      item.get('id') == id && item.get('type') == type
    , @


    newIndex = if previous then selectedIndex - 1 else selectedIndex + 1
    newSelected = organizationsAndProjects.get(newIndex)
    if !newSelected
      #    go back to first which is always organization
      return @setState
        selectedProjectId: null
        selectedOrganizationId: organizationsAndProjects.first().get 'id'
    else
      return @_setSelectedItem newSelected

  _goToSelectedProjectOrOrganization: ->
    if @state.selectedProjectId
      window.location.href = @_projectUrl @state.selectedProjectId
    else if @state.selectedOrganizationId
      window.location.href = @_organizationUrl @state.selectedOrganizationId

  _setSelectedItem: (item) ->
    if item.get('type') == 'organization'
      @setState
        selectedProjectId: null
        selectedOrganizationId: item.get 'id'
    else
      @setState
        selectedProjectId: item.get 'id'
        selectedOrganizationId: null


  _newProject: ->
    ul className: 'list-unstyled kbc-project-select-new',
      li null,
        a onClick: @openModal,
          i className: 'kbc-icon-plus'
          'New Project'
        React.createElement NewProjectModal,
          urlTemplates: @props.urlTemplates
          projectTemplates: @props.projectTemplates
          xsrf: @props.xsrf
          isOpen: @state.isNewProjectModalOpen
          onHide: @closeModal
          organizations: @props.organizations.filter (organization) -> organization.get('hasAccess')

  openModal: ->
    @setState
      isNewProjectModalOpen: true

  closeModal: ->
    @setState
      isNewProjectModalOpen: false


